import { readFile } from 'fs'
import hbs from 'handlebars'
import { resolve } from 'path'
import { promisify } from 'util'

import { AdditionalType } from '@/Models/additional.model'
import { OrderType } from '@/Models/order.model'
import { ProductType } from '@/Models/product.model'

import CEP from './cep.functions'
import WhatsApp from './whatsapp.functions'

function _formatPrice(rawPrice: string | number): string {
  return parseFloat(`${rawPrice}`)
    .toFixed(2)
    .toString()
    .replace('.', ',')
}

async function _populate(context: Record<string, any>): Promise<string> {
  const asyncReadFile = promisify(readFile)

  const templatePath = resolve(__dirname, '..', 'Templates', 'new-order.txt')
  const rawTemplate = await asyncReadFile(templatePath, { encoding: 'UTF-8' })

  const hbsTemplate = hbs.compile(rawTemplate.toString())

  return hbsTemplate(context)
}

interface OrderDeliveryType {
  type: string
  cep?: string
  number?: string
  complement?: string
}
async function delivery(delivery: OrderDeliveryType): Promise<string> {
  let payload = 'O pedido será retirado no local'
  if (delivery.type === 'delivery') {
    const addressPayload = await CEP.getAddresFromCep(delivery)
    payload = 'O pedido é para ser entregue em:'
    payload = `${payload}\n  *Endereço:* ${addressPayload.raw}`
    payload = `${payload}\n  *Mapa:* ${addressPayload.mapLink}`
  }
  return payload
}

interface OrderItem {
  additional?: AdditionalType[]
  item: ProductType
  ingredients?: Array<string>
  qtt: number
}
async function items(items: OrderItem[]): Promise<string> {
  function mountIngredients(ingredients: Array<string>): string {
    return ingredients.map(ingredient => `    ${ingredient}`).join('\n')
  }
  function mountAddiotinal(additional: AdditionalType[]): string {
    return additional
      .map(({ label, price }) => `   + ${label} ${_formatPrice(price)}`)
      .join('\n')
  }

  return items
    .map(({ additional, ingredients, item, qtt }) => {
      let itemEntry = `  ${qtt}x ${item.title} R$ ${_formatPrice(item.price)}`
      if (ingredients) {
        const ingredientsEntry = mountIngredients(ingredients)
        itemEntry = `${itemEntry}\n${ingredientsEntry}`
      }
      if (additional) {
        const additionalEntry = mountAddiotinal(additional)
        itemEntry = `${itemEntry}\n${additionalEntry}`
      }
      return itemEntry
    })
    .join('\n')
}

interface OrderPaymentType {
  method: string
  change?: string
}
function payment(payment: OrderPaymentType): string {
  return `${payment.method}${
    payment.change ? `, troco para ${payment.change}` : ''
  }`
}

function total(items: OrderItem[]): string {
  function reduceAdditional(additional: AdditionalType[]): number {
    return additional.reduce((acc, { price }) => acc + price, 0)
  }

  const total = items.reduce((acc, { additional, item, qtt }) => {
    const additionalTotal = reduceAdditional(additional || [])
    return qtt * item.price + additionalTotal + acc
  }, 0)

  return total
    .toFixed(2)
    .toString()
    .replace('.', ',')
}

interface OrderTypePopulated extends OrderType {
  items: OrderItem[]
}
interface BuildFnParams {
  order: any
  userAgent: string
}
async function build({ order, userAgent }: BuildFnParams): Promise<string> {
  if (!order) return ''

  const context = {
    delivery: await delivery(order.delivery),
    items: await items(order.items),
    payment: await payment(order.payment),
    user: { ...order.toObject().user },
    total: total(order.items)
  }

  const content = await _populate(context)
  return WhatsApp.buildLinkToChat({ content, userAgent })
}

export default { build }

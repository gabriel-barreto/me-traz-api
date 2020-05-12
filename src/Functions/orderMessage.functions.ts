import { readFile } from 'fs'
import hbs from 'handlebars'
import { resolve } from 'path'
import { promisify } from 'util'

import { AdditionalType } from '@/Models/additional.model'
import { OrderType } from '@/Models/order.model'
import { ProductType } from '@/Models/product.model'

import CEP from './cep.functions'

async function _populate(context: Record<string, string>): Promise<string> {
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
      .map(({ label, price }) => `   + ${label} ${price}`)
      .join('\n')
  }

  return items
    .map(({ additional, ingredients, item, qtt }) => {
      let itemEntry = `  ${qtt}x ${item.title} R$ ${item.price}`
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
  type: string
  change?: string
}
function payment(payment: OrderPaymentType): string {
  return `${payment.type}${
    payment.change ? `, troco para ${payment.change}` : ''
  }`
}

interface OrderTypePopulated extends OrderType {
  items: OrderItem[]
}
interface BuildFnParams {
  phone: string
  order: OrderTypePopulated | Record<string, any>
}
async function build({ order, phone }: BuildFnParams): Promise<string> {
  if (!order) return ''

  const context = {
    delivery: await delivery(order.delivery),
    items: await items(order.items),
    payment: await payment(order.payment),
    user: { ...order.user }
  }

  const messageContent = await _populate(context)
  console.log(messageContent)
  return encodeURI(
    `https://web.whatsapp.com/send?phone=${phone}&text=${messageContent}`
  )
}

export default { build }
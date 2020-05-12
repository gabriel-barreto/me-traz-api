import CEP from 'cep-promise'

interface GetAddressFromCepParams {
  cep?: string
  number?: string
  complement?: string
}
interface AddressPayload {
  raw: string
  mapLink: string
}
async function getAddresFromCep({
  cep,
  number,
  complement
}: GetAddressFromCepParams): Promise<AddressPayload> {
  if (!cep) {
    const message = 'Endereço não encontrado.'
    return { raw: message, mapLink: message }
  }

  const { street, city, state, neighborhood } = await CEP(cep)
  const address = `${street}, ${number}, ${neighborhood}`

  return {
    raw: complement ? `${address}/${complement}` : address,
    mapLink: encodeURI(
      `https://maps.google.com/maps/place/${address}, ${city} - ${state}`
    )
  }
}

export default { getAddresFromCep }

export enum Products {
  ACCESSORIES = "Acessórios",
  FITMENT = "Móveis",
  ELECTRONICS = "Eletrônicos"
}

export type TUser = {
  id: string,
  name: string,
  email: string,
  password: string
}

export type TProduct = {
  id: string,
  name: string,
  price: number,
  description: string,
  imageUrl: string
}

export type TProductToBuy = {
  productId: string,
  quantity: number
}

export type TPurchase = {
  purchaseId: string,
  buyerId: string
}
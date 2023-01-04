export enum Products {
  ACCESSORIES = "Acessórios",
  FITMENT = "Móveis",
  ELECTRONICS = "Eletrônicos"
}

export type TUser = {
  id: string,
  email: string,
  password: string
}

export type TProduto = {
  id: string,
  name: string,
  price: number,
  category: Products
}

export type TPurchase = {
  userId: string,
  productId: string,
  quantity: number,
  totalPrice: number
}
import {TUser, TProduto, TPurchase} from './types'

export const Users: TUser[] = [
  {
    id: "laisrmacedo",
    email: "laisrmacedo@gmail.com",
    password: "anonovo"
  },
  {
    id: "fulanodetal",
    email: "fulanodetal@gmail.com",
    password: "fulano"
  }
]

export const Produtos: TProduto[] = [
  {
    id: "1025",
    name: "cadeira",
    price: 50,
    category: "moveis"
  },
  {
    id: "1055",
    name: "smartphone",
    price: 1850,
    category: "tecnologia"
  }
]

export const Purchase: TPurchase[] = [
  {  
    userId: "laisrmacedo",
    productId: "1025",
    quantity: 4,
    totalPrice: 200
  },
  {  
    userId: "fulanodetal",
    productId: "1055",
    quantity: 1,
    totalPrice: 1850
  }
]



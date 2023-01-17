import {TUser, TProduto, TPurchase, Products} from './types'

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
  },
  {
    id: "userDeletado",
    email: "userdeletado@gmail.com",
    password: "deletado"
  }
]

export const Produtos: TProduto[] = [
  {
    id: "p1025",
    name: "cadeira",
    price: 50,
    category: Products.FITMENT
  },
  {
    id: "p1055",
    name: "smartphone",
    price: 1850,
    category: Products.ELECTRONICS
  },
  {  
    id: "p1022",
    name: "anel",
    price: 150,
    category: Products.ACCESSORIES
  }
]

export const Purchase: TPurchase[] = [
  {  
    userId: "laisrmacedo",
    productId: "p1025",
    quantity: 4,
    totalPrice: 200
  },
  {  
    userId: "fulanodetal",
    productId: "p1055",
    quantity: 1,
    totalPrice: 1850
  }
]

//EXERCICIO 2 
//USER
export const createUser = (user: string, userEmail: string, userPassword: string) => {
  Users.push({id: user, email: userEmail, password: userPassword})
  console.log(">>> Cadastro realizado com sucesso <<<")
}

export const getAllUsers = () => {
  console.table(Users)
}

//PRODUCT
export const createProduct = (productId: string, productName: string, productPrice: number, productCategory: Products) => {
  Produtos.push({id: productId, name: productName, price: productPrice, category:productCategory})
  console.log(">>> Produto criado com sucesso <<<")
}

export const getAllProducts = () => {
  console.table(Produtos)
}

export const getProductById = (idToSearch: string) => {
  const foundProduct = Produtos.filter((item) => item.id === idToSearch)
  
  if(foundProduct.length == 0){
    console.log("Resultado da busca: Produto não encontrado")
  }else{
    console.log("Resultado da busca:", foundProduct)
  }
}

//EXERCICIO 3
export const queryProductsByName  = (q: string) => {
  const foundProduct = Produtos.filter((item) => item.name === q)
  
  if(foundProduct.length == 0){
    console.log("Resultado da busca: Produto não encontrado")
  }else{
    console.log("Resultado da busca:", foundProduct)
  }
}

export const createPurchase  = (userId: string, productId: string, quantity: number) => {
  Purchase.push({userId: userId, productId: productId, quantity: quantity, totalPrice: quantity * Produtos[2].price})
  console.log(">>> Compra realizada com sucesso <<<")
}

export const getAllPurchasesFromUserId   = (userIdToSearch: string) => {
  const foundProduct = Purchase.filter((item) => item.userId === userIdToSearch)
  
  if(foundProduct.length == 0){
    console.log("Resultado da busca: Usuário não encontrado")
  }else{
    console.log("Resultado da busca:", foundProduct)
  }
}


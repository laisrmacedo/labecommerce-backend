//node-packege.json
// console.log("funcionou")
// const teste = process.argv[2]

//typescriptI
// import {Users, Produtos, Purchase} from './database'

// console.table(Users)
// console.table(Produtos)
// console.table(Purchase)

//typescriptII
// import {createUser, getAllUsers} from './database'

// createUser("novousuario", "novousuario@gmail.com", "novato")

// getAllUsers()

// import {createProduct, 
//         getAllProducts, 
//         getProductById, 
//         queryProductsByName, 
//         createPurchase, 
//         getAllPurchasesFromUserId
//       } from './database'
// import {Products} from './types'

// createProduct("p5121", "anel", 284, Products.ACCESSORIES)

// getAllProducts()

// getProductById("p1055")
// getProductById("p10")

// queryProductsByName("cadeira")
// queryProductsByName("monitor")

// createPurchase("novousuario", "p5121", 2)
// getAllPurchasesFromUserId("laisrmacedo")

import express, { Request, Response } from 'express'
import cors from 'cors'
import { Users, Produtos, Purchase } from './database'
import {TUser, TProduto, TPurchase} from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//exercicio 2
app.get('/users', (req: Request, res: Response) => {
  res.status(200).send(Users)
})

app.get('/produtos', (req: Request, res: Response) => {
  res.status(200).send(Produtos)
})

app.get('/purchase', (req: Request, res: Response) => {
  res.status(200).send(Purchase)
})

app.get('/produtos/search', (req: Request, res: Response) => {
  const q = req.query.q as string
  const result = Produtos.filter((produto)=>{
    return produto.name.toLowerCase().includes(q.toLowerCase())
  })
  res.status(200).send(result)
})

//exercicio 3

app.post('/users', (req: Request, res: Response) => {
  const {id, email, password} = req.body as TUser
  const newUser = {
    id,
    email,
    password
  }
  Users.push(newUser)
  res.status(201).send("Usuário cadastrado com sucesso")
})

app.post('/produtos', (req: Request, res: Response) => {
  const {id, name, price, category} = req.body as TProduto
  const newProduto = {
    id,
    name,
    price,
    category
  }
  Produtos.push(newProduto)
  res.status(201).send("Produto cadastrado com sucesso")
})

app.post('/purchase', (req: Request, res: Response) => {
  const {userId, productId, quantity, totalPrice} = req.body as TPurchase
  const newPurchase = {
    userId,
    productId,
    quantity,
    totalPrice
  }
  Purchase.push(newPurchase)
  res.status(201).send("Compra registrada com sucesso")
})

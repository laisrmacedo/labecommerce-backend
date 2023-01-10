import express, { Request, Response } from 'express'
import cors from 'cors'
import { Users, Produtos, Purchase } from './database'
import {TUser, TProduto, TPurchase, Products} from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//all users
app.get('/users', (req: Request, res: Response) => {
  res.status(200).send(Users)
})

//create user
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

//delete user by id
app.delete('/users/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const userIndex = Users.findIndex((user)=>{
    return user.id === id
  })

  if(userIndex>=0){
    Users.splice(userIndex, 1)
    res.status(200).send('User deletado com sucesso')
  }else{
      res.status(404).send('User nao encontrado')
  }
})

//edit user by id
app.put('/user/:id', (req: Request, res: Response)=>{
  const id = req.params.id

  const newId = req.body.id as string | undefined
  const newEmail = req.body.email as string | undefined
  const newPassword = req.body.password as string | undefined
  
  const foundUser = Users.find((user) => {
      return user.id === id
  })

  if(foundUser){
      foundUser.id = newId || foundUser.id
      foundUser.email = newEmail || foundUser.email
      foundUser.password = newPassword || foundUser.password

      res.status(200).send('User editado com sucesso')
  }else{
      res.status(404).send('User nao encontrado')
  }
})

//======================================================

//all products
app.get('/produtos', (req: Request, res: Response) => {
  res.status(200).send(Produtos)
})

//products by id
app.get('/produtos/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = Produtos.filter((produto)=>{
    return produto.id === id
  })
  res.status(200).send(result)
})

//products by name
app.get('/produtos/search', (req: Request, res: Response) => {
  const q = req.query.q as string
  const result = Produtos.filter((produto)=>{
    return produto.name.toLowerCase().includes(q.toLowerCase())
  })
  res.status(200).send(result)
})

//delete produto by id
app.delete('/produtos/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const produtoIndex = Produtos.findIndex((produto)=>{
    return produto.id === id
  })
  
  if(produtoIndex>=0){
    Produtos.splice(produtoIndex, 1)
    res.status(200).send('Produto deletado com sucesso')
  }else{
      res.status(404).send('Produto nao encontrado')
  }
})

//edit product by id
app.put('/produtos/:id', (req: Request, res: Response)=>{
  const id = req.params.id

  const newId = req.body.id as string | undefined
  const newName = req.body.name as string | undefined
  const newPrice = req.body.price as number | undefined
  const newCategory = req.body.category as Products | undefined

  const foundProduct = Produtos.find((product) => {
      return product.id === id
  })

  if(foundProduct){
      foundProduct.id = newId || foundProduct.id
      foundProduct.name = newName || foundProduct.name
      foundProduct.price = newPrice || foundProduct.price
      foundProduct.category = newCategory || foundProduct.category

      res.status(200).send('Produto editado com sucesso')
  }else{
      res.status(404).send('Produto nao encontrado')
  }
})

//======================================================

//all purchase
app.get('/purchase', (req: Request, res: Response) => {
  res.status(200).send(Purchase)
})

//purchase by user id
app.get('/users/:id/purchase/', (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = Purchase.filter((purchase)=>{
    return purchase.userId === id
  })
  res.status(200).send(result)
})

//create product
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

//create purchase
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

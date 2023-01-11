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
  try {
    res.status(200).send(Users)
  } catch (error) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error)
  }
})

//create user
app.post('/users', (req: Request, res: Response) => {
  const {id, email, password} = req.body as TUser

  if(id === undefined || email === undefined || password === undefined){
    res.status(400)
    throw new Error("Todos os campos são obrigatórios.")
  }

  // >>>>Verificação ID
    const foundProductUserId = Users.find((user)=>{
      return user.id === id && user.email === email
    })

    if(!foundProductUserId){
      const newUser = {
        id,
        email,
        password
      }
      Users.push(newUser)
      res.status(201).send("Usuário cadastrado com sucesso")
    }
})

//delete user by id
app.delete('/users/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const userIndex = Users.findIndex((user)=>{
    return user.id === id
  })


// >>>>Verificaçao se usuaario existe
    if(!userIndex){
      res.status(404)
      throw new Error("Usuário não encontrado")
    }

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

// >>>>Verificaçao se produto existe
      if(!foundUser){
        res.status(404)
        throw new Error("Produto não encontrado")
      }

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
  try {
    res.status(200).send(Produtos)
  } catch (error) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error)
  }
})

//products by id
app.get('/produtos/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const result = Produtos.filter((produto)=>{
      return produto.id === id
    })

    if(!result){
      res.status(404)
      throw new Error("Produto não encontrado")
    }else{
      res.status(200).send(result)
    }

  } catch (error) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error)
  }
})

//products by name
app.get('/produtos/search', (req: Request, res: Response) => {
  try {
    const q = req.query.q as string
    if(q.length < 1){
      res.status(400)
      throw new Error("'Query' deve ter pelo menos 1 caractere")
    }
    const result = Produtos.filter((produto)=>{
      return produto.name.toLowerCase().includes(q.toLowerCase())
    })
    res.status(200).send(result)
    
  } catch (error) {
    console.log(error)
    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error)
  }
})

//delete produto by id
app.delete('/produtos/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const produtoIndex = Produtos.findIndex((produto)=>{
    return produto.id === id
  })

// >>>>Verificaçao se produto existe
    if(!produtoIndex){
      res.status(404)
      throw new Error("Produto não encontrado")
    }
  
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

// >>>>Verificaçao se produto existe
      if(!foundProduct){
        res.status(404)
        throw new Error("Produto não encontrado")
      }

  if(foundProduct){
      foundProduct.id = newId || foundProduct.id
      foundProduct.name = newName || foundProduct.name
      foundProduct.price = newPrice || foundProduct.price
      foundProduct.category = newCategory || foundProduct.category

      res.status(200).send('Produto editado com sucesso')
  }else{//redundante?
      res.status(404).send('Produto nao encontrado')
  }
})

//create product
app.post('/produtos', (req: Request, res: Response) => {
  const {id, name, price, category} = req.body as TProduto

  if( id === undefined || 
      name === undefined || 
      price === undefined ||
      category === undefined
    ){
      res.status(400)
      throw new Error("Todos os campos são obrigatórios.")
  }

// >>>>Verificação ID
    const foundProductId = Produtos.find((produto)=>{
      return produto.id === id
    })

    if(!foundProductId){
      const newProduto = {
        id,
        name,
        price,
        category
      }
      Produtos.push(newProduto)
      res.status(201).send("Produto cadastrado com sucesso")
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
  const foundUserId = Purchase.filter((purchase)=>{
    return purchase.userId === id
  })

// >>>>Verificação se usuario existe
    if(!foundUserId){
      res.status(404)
      throw new Error("Usuario não encontrado")
    }else{
      res.status(200).send(foundUserId)
    }

})

//create purchase
app.post('/purchase', (req: Request, res: Response) => {
  const {userId, productId, quantity, totalPrice} = req.body as TPurchase

  if( userId === undefined || 
      productId === undefined || 
      quantity === undefined ||
      totalPrice === undefined
    ){
      res.status(400)
      throw new Error("Todos os campos são obrigatórios.")
  }

// >>>>Verificação User ID
      const foundUserId = Users.find((user)=>{
        return user.id === userId
      })
      console.log(foundUserId)

      if(!foundUserId){
        res.status(400)
        throw new Error("Usuário não encontrado")
      }

// >>>>Verificação Product ID
      const foundProductId = Produtos.find((produto)=>{
        return produto.id === productId
      })
      console.log(foundProductId)

      if(!foundProductId){
        res.status(400)
        throw new Error("Produto não encontrado")
      }

// >>>>Verificação Valor
      const foundPrice = Produtos.find((produto)=>{
        return produto.price === foundProductId.price
      })

      if(!foundPrice){
        res.status(400)
        throw new Error("Produto não encontrado")
      }else{
        if (totalPrice !== quantity * foundProductId.price) {
          res.status(400)
          throw new Error("A quantidade ou o valor total está incorreto.")
        }
      }


  const newPurchase = {
    userId,
    productId,
    quantity,
    totalPrice
  }
  Purchase.push(newPurchase)
  res.status(201).send("Compra registrada com sucesso")
})

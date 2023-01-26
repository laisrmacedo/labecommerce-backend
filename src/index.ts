import express, { Request, Response } from 'express'
import cors from 'cors'
import { Users, Produtos, Purchase } from './database'
import {TUser, TProduto, TPurchase, Products} from './types'
import { db } from '../src/database/knex'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

//teste
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string | undefined
    if(searchTerm === undefined){
      const result = await db('users')
      res.status(200).send(result)
    }else {
      const result = await db('users').where("id", "LIKE", `%${searchTerm}%`)
      res.status(200).send(result)
    }
    
  } catch (error) {
    console.log(error)
    if (req.statusCode === 200) {
        res.status(500)
    }
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//create user
app.post('/users', async (req: Request, res: Response) => {
  try {
    const {id, email, password} = req.body as TUser
  
    if(!id || !email || !password){
      res.status(400)
      throw new Error("Todos os campos são obrigatórios.")
    }

    if(typeof id !== "string" || typeof email !== "string" || typeof password !== "string"){
      res.status(400)
      throw new Error("Dado inválido. Todos devem ser do tipo 'string'.")
    }
    if(id.length < 4){
      res.status(400)
      throw new Error("id deve ter pelo menos 4 caracteres")
    }
    if(id[0] !== "u") {
      res.status(400)
      throw new Error("id deve iniciar com a letra 'u'")
    }
    if (!email.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
			throw new Error("O email deve ter o formato 'exemplo@exemplo.com'.")
		}
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
    
    // >>>>Verificação de repetição
      const [foundUserId] = await db('users').where({id})
      const [foundUserEmail] = await db('users').where({email})
  
      // if(!foundUserId && !foundUserEmail){
      //   await db('users').insert({id, email, password})
      //   res.status(201).send("Usuário cadastrada com sucesso")
      // }

      if(foundUserId){
        res.status(404)
        throw new Error("Este id já está cadastrado")
      }
      if(foundUserEmail){
        res.status(404)
        throw new Error("Este email já está cadastrado")
      }

      await db('users').insert({id, email, password})
      res.status(201).send("Usuário cadastrada com sucesso")
    
  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }

})

//delete user by id
app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id 
    //Não funciona
    if(!id) {
      res.status(404)
      throw new Error('Informe um id')
    }

    // >>>>Verificaçao se usuaario existe
    const [foundId] = await db("users").where({id})

    if(foundId){
      await db("users").del().where({id})
      res.status(200).send("Usuário deletado com sucesso")
    }else {
      res.status(404)
      throw new Error("Usuário não encontrado")
    }

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//edit user by id
app.put('/user/:id', async (req: Request, res: Response)=>{
  try {
    const idToEdit = req.params.id
    if(!idToEdit) {
      res.status(404)
      throw new Error('Informe um id')
    }

    const {id: newId, email: newEmail, password: newPassword} = req.body as TUser

    const [foundUser] = await db('users').where({id: idToEdit})

// >>>>Verificaçao se produto existe
    if(foundUser){
      const newUser = {
        id: newId || foundUser.id, 
        email: newEmail || foundUser.email, 
        password: newPassword || foundUser.password
      }

      await db('users').update(newUser).where({id: idToEdit})
      res.status(200).send('User editado com sucesso')
    } else{
      res.status(404)
      throw new Error("Usuário não encontrado")
    }

  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//======================================================

//all products
app.get('/products', async (req: Request, res: Response) => {
  try {
    const result = await db('products')
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    if (req.statusCode === 200) {
        res.status(500)
    }
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//products by id
app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const result = await db.raw(`
      SELECT * FROM products 
      WHERE id = "${id}";`)

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
app.get('/products/search', async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string
    const result = await db.raw(`
      SELECT * FROM products 
      WHERE name = "${name}";
    `)
    
    if(result.length < 1){
      res.status(400)
      throw new Error("'Query' deve ter pelo menos 1 caractere")
    }
    
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    if (req.statusCode === 200) {
        res.status(500)
    }
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//delete produto by id
app.delete('/products/:id', (req: Request, res: Response) => {
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
app.put('/products/:id', (req: Request, res: Response)=>{
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
app.post('/products', (req: Request, res: Response) => {
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
app.get('/purchase', async (req: Request, res: Response) => {
  try {
    const result = await db('purchases')
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    if (req.statusCode === 200) {
        res.status(500)
    }
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
})

//purchase by id
app.get('/purchase/:id', async (req: Request, res:Response) => {
  try {
    const id = req.params.id
    const [foundPurchase] = await db('purchases').where({id})

    if(foundPurchase){
      res.status(200).send(foundPurchase)
    }else{
      res.status(404)
      throw new Error("Informe uma Id")
    }

  } catch (error) {
    console.log(error)
    if (req.statusCode === 200) {
        res.status(500)
    }
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
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
  try {
    const {id, total_price, paid, delivered_at, buyer_id} = req.body


  } catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
  }
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

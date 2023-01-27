import express, { Request, Response } from 'express'
import cors from 'cors'
// import { Users, Produtos, Purchase } from './database'
import {TUser, TProduct, TPurchase, Products, TProductToBuy} from './types'
import { db } from '../src/database/knex'
import console from 'console'

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

//all users and users by name - OK
app.get('/users', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string | undefined
    const result = await db('users')
    let stylizedResult = []
    for (const user of result) {
      stylizedResult.push({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password, 
        createdAt: user.created_at
      })
    }
    if(searchTerm === undefined){
      res.status(200).send(stylizedResult)
    }else {
      const resultQuery = stylizedResult.filter((user) => user.name.includes(searchTerm))
      res.status(200).send(resultQuery)
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

//create user - OK
app.post('/users', async (req: Request, res: Response) => {
  try {
    const {id, name, email, password} = req.body as TUser
  
    if(!id || !name || !email || !password){
      res.status(422)
      throw new Error("ERRO: Todos os dados são obrigatórios.")
    }
    
  // >>>>Verificações de tipo
    if(typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string"){
      res.status(404)
      throw new Error("ERRO: Dado inválido. Todos devem ser do tipo 'string'.")
    }

  // >>>>Verificações de padrão
    if(id[0] !== "u") {
      res.status(404)
      throw new Error("ERRO: Id deve iniciar com a letra 'u'")
    }
    if(id.length < 4){
      res.status(404)
      throw new Error("ERRO: Id deve ter pelo menos 4 caracteres")
    }
    if(name.length < 2) {
      res.status(404)
      throw new Error("ERRO: Name deve ter pelo menos 2 caracteres")
    }
    if (!email.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
			throw new Error("ERRO: Email deve ter o formato 'exemplo@exemplo.com'.")
		}
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("ERRO: Password deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
    
    // >>>>Verificação de repetição
      const [foundUserId] = await db('users').where({id})
      const [foundUserEmail] = await db('users').where({email})

      if(foundUserId){
        res.status(404)
        throw new Error("ERRO: Este id já está cadastrado")
      }
      if(foundUserEmail){
        res.status(404)
        throw new Error("ERRO: Este email já está cadastrado")
      }

      const newUser = {id, name, email, password}
      await db('users').insert(newUser)
      const [createdUser] = await db('users').where({id: newUser.id})

      const stylizedUser = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password, 
        createdAt: createdUser.created_at
      }

      res.status(201).send({
        message: "Usuário cadastrado com sucesso",
        user: stylizedUser
      })
    
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

//delete user by id EXTRA - OK
app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id

    if(idToDelete === ":id") {
      res.status(404)
      throw new Error('ERRO: Informe um id')
    }

    // >>>>Verificaçao se usuaario existe
    const [foundId] = await db("users").where({id: idToDelete})

    if(foundId){
      await db("users").del().where({id: idToDelete})
      res.status(200).send({message: "Usuário deletado com sucesso"})
    }else {
      res.status(404)
      throw new Error("ERRO: Usuário não encontrado")
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

// edit user by id EXTRA - OK
app.put('/users/:id', async (req: Request, res: Response)=>{
  try {
    const idToEdit = req.params.id
    if(idToEdit === ":id") {
      res.status(404)
      throw new Error('ERRO: Informe um id')
    }

    const {id: newId, name: newName, email: newEmail, password: newPassword} = req.body as TUser

    // >>>>Verificaçao se user existe
    const [foundUser] = await db('users').where({id: idToEdit})
    if(!foundUser){
      res.status(404)
      throw new Error("ERRO: Usuário não encontrado")
    }
    
    // >>>>Verificaçao de repetição
    const [foundId] = await db('users').where({id: newId})
    const [foundEmail] = await db('users').where({email: newEmail})

    if(foundId && foundUser.id !== foundId){
      res.status(404)
      throw new Error("ERRO: Este id já está cadastrado")
    }
    if(foundEmail && foundUser.email !== foundEmail){
      res.status(404)
      throw new Error("ERRO: Este email já está cadastrado")
    }

    // >>>>Verificaçao de padrão
    if(newId[0] !== "u") {
      res.status(400)
      throw new Error("ERRO: Id deve iniciar com a letra 'u'")
    }
    if(newId.length < 4){
      res.status(400)
      throw new Error("ERRO: Id deve ter pelo menos 4 caracteres")
    }
    if(newName.length < 2) {
      res.status(400)
      throw new Error("ERRO: Nome deve ter pelo menos 2 caracteres")
    }
    if (!newEmail.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
			throw new Error("ERRO: Email deve ter o formato 'exemplo@exemplo.com'.")
		}
    if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("ERRO: Password deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
    
    const newUser = {
      id: newId || foundUser.id, 
      name: newName || foundUser.name, 
      email: newEmail || foundUser.email, 
      password: newPassword || foundUser.password
    }

    await db('users').update(newUser).where({id: idToEdit})
    res.status(200).send({message: 'User editado com sucesso'})

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

//all products and products by name - OK
app.get('/products', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string | undefined

    const result = await db('products')
    let stylizedResult = []
    for (const product of result) {
      stylizedResult.push({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description, 
        imageUrl: product.image_url
      })
    }
    console.log(stylizedResult)
    if(searchTerm === undefined){
      res.status(200).send(stylizedResult)
    }else {
      const resultQuery = stylizedResult.filter((product) => product.name.includes(searchTerm))
      res.status(200).send(resultQuery)
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

//delete produto by id
app.delete('/products/:id', (req: Request, res: Response) => {
//   const id = req.params.id as string
//   const produtoIndex = Produtos.findIndex((produto)=>{
//     return produto.id === id
//   })

// >>>>Verificaçao se produto existe
//     if(!produtoIndex){
//       res.status(404)
//       throw new Error("Produto não encontrado")
//     }
  
//   if(produtoIndex>=0){
//     Produtos.splice(produtoIndex, 1)
//     res.status(200).send('Produto deletado com sucesso')
//   }else{
//       res.status(404).send('Produto nao encontrado')
//   }
})

//create product - OK
app.post('/products', async (req: Request, res: Response) => {
  try {
    const {id, name, price, description, imageUrl} = req.body as TProduct

    if(!id || !name || isNaN(price) || !description || !imageUrl){
        res.status(400)
        throw new Error("ERRO: Todos os dados são obrigatórios.")
    }

    // >>>>Verificação de tipo
    if(typeof id !== "string" || 
      typeof name !== "string" || 
      typeof description !== "string" || 
      typeof imageUrl !== "string"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Id, name, description e imageUrl devem ser do tipo 'string'`)
    }

    if(typeof price !== "number"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Price deve ser do tipo 'number'`)
    }

    // >>>>Verificação de repetição de ID
    const [foundProductId] = await db('products').where({id})
    if(foundProductId){
      res.status(404)
      throw new Error("ERRO: Este id já existe")
    }

    // >>>>Verificações de padrão
    if(id[0] !== "p") {
      res.status(400)
      throw new Error("ERRO: Id deve iniciar com a letra 'p'")
    }
    if(id.length < 4){
      res.status(400)
      throw new Error("ERRO: Id deve ter pelo menos 4 caracteres")
    }
    if(name.length < 2) {
      res.status(400)
      throw new Error("ERRO: Name deve ter pelo menos 2 caracteres")
    }
    if(description.length < 2) {
      res.status(400)
      throw new Error("ERRO: Description deve ter pelo menos 2 caracteres")
    }

    const newProduct = {
      id, 
      name, 
      price, 
      description, 
      image_url: imageUrl
    }
    await db('products').insert(newProduct)

    res.status(201).send({
      message: "Produto cadastrado com sucesso",
    })
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

//edit product by id - OK
app.put('/products/:id', async (req: Request, res: Response)=>{
  try {
    const idToEdit = req.params.id
    if(idToEdit === ":id") {
      res.status(404)
      throw new Error('ERRO: Informe um id')
    }

  // >>>>Verificaçao se user existe
    const [foundProduct] = await db('products').where({id: idToEdit})
    if(!foundProduct){
      res.status(404)
      throw new Error("ERRO: Produto não encontrado")
    }

    const {
      id: newId, 
      name: newName, 
      price: newPrice, 
      description: newDescription, 
      imageUrl: newImageUrl
    } = req.body as TProduct

  // >>>>Verificação de tipo
    if(newId && typeof newId !== "string"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Id deve ser do tipo 'string'`)
    }
    if(newName && typeof newName !== "string"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Name deve ser do tipo 'string'`)
    }
    if(newPrice && typeof newPrice !== "number"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Price deve ser do tipo 'number'`)
    }
    if(newDescription && typeof newDescription !== "string"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. Description deve ser do tipo 'string'`)
    }
    if(newImageUrl && typeof newImageUrl !== "string"){
      res.status(400)
      throw new Error(`ERRO: Dado inválido. ImageUrl deve ser do tipo 'string'`)
    }
    
    // >>>>Verificaçao de repetição
    if(newId){
      const [foundId] = await db('products').where({id: newId})
      if(foundId && foundProduct.id !== foundId){
        res.status(404)
        throw new Error("ERRO: Este id já está cadastrado")
      }
    }

    // >>>>Verificaçao de padrão
    if(newId && newId[0] !== "p") {
      res.status(400)
      throw new Error("ERRO: Id deve iniciar com a letra 'p'")
    }
    if(newId && newId.length < 4){
      res.status(400)
      throw new Error("ERRO: Id deve ter pelo menos 4 caracteres")
    }
    if(newName && newName.length < 2) {
      res.status(400)
      throw new Error("ERRO: Nome deve ter pelo menos 2 caracteres")
    }
    if(newDescription && newDescription.length < 2) {
      res.status(400)
      throw new Error("ERRO: Description deve ter pelo menos 2 caracteres")
    }
    
    const newProduct = {
      id: newId || foundProduct.id, 
      name: newName || foundProduct.name, 
      price: newPrice || foundProduct.price, 
      description: newDescription || foundProduct.description,
      image_url: newImageUrl || foundProduct.image_url
    }

    // console.log(newProduct)

    await db('products').update(newProduct).where({id: idToEdit})
    res.status(200).send({message: 'Produto editado com sucesso'})

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

//all purchase EXTRA - OK
app.get('/purchases', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string | undefined
    if(searchTerm === undefined){
      const result = await db('purchases')
      res.status(200).send(result)
    }else {
      const result = await db('purchases').where("id", "LIKE", `%${searchTerm}%`)
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

// Create purchases - OK
app.post('/purchases', async (req: Request, res: Response) => {
  try {
    const {purchaseId, buyerId} = req.body as TPurchase
    const productsToBuy = req.body.products as TProductToBuy[]
    // console.log(productsToBuy)
    if( !purchaseId || !buyerId){
      res.status(400)
      throw new Error("ERRO: purchaseId e buyerId são dados são obrigatórios.")
    }

  // >>>>Verificações de padrão
    if(typeof purchaseId !== "string") {
      res.status(400)
      throw new Error("ERRO: PurchaseId deve ser do tipo string")
    }
    if(purchaseId[0] !== "c") {
      res.status(400)
      throw new Error("ERRO: PurchaseId deve iniciar com a letra 'c'")
    }
    if(purchaseId.length < 4){
      res.status(400)
      throw new Error("ERRO: PurchaseId deve ter pelo menos 4 caracteres")
    }
  
  // >>>>Verificação de repetição de ID de compra
    const [foundPurchasetId] = await db('purchases').where({id: purchaseId})
    if(foundPurchasetId){
      res.status(404)
      throw new Error("ERRO: Este purchaseId já existe")
    }

  // >>>>Verificação de existencia do buyer
    const [foundPurchasetBuyer] = await db('users').where({id: buyerId})
    if(!foundPurchasetBuyer){
      res.status(404)
      throw new Error("ERRO: Este buyerId não está cadastrado")
    }

  // >>>>Verificação de validade de dados dos produtos
  for (const i in productsToBuy) {
    if(!productsToBuy[i].productId || typeof productsToBuy[i].productId !== "string" || productsToBuy[i].productId === ""){
      res.status(400)
      throw new Error("ERRO: Informe o productId em formato de string")
    }
    if( !productsToBuy[i].quantity || typeof productsToBuy[i].quantity !== "number" || productsToBuy[i].quantity < 1){
      res.status(400)
      throw new Error("ERRO: Informe a quantidade (número > 1) de todos os produtos")
    }
  }


  // >>>>Verificação de existencia do produto
  for (const i in productsToBuy) {
    const [foundProducttId] = await db('products').where({id: productsToBuy[i].productId})
    if(!foundProducttId){
        res.status(404)
        throw new Error(`ERRO: O productId: ${productsToBuy[i].productId} não está cadastrado`)
    }else{
        //passou, então posso popular tabela purchases_products pq é o carrinho
        //para cada produto no carrinho criar um registro de compra
        const newPurchaseProduct = {
          purchase_id: purchaseId, 
          product_id: productsToBuy[i].productId,
          quantity: productsToBuy[i].quantity
        }
        await db("purchases_products").insert(newPurchaseProduct)
    }
      
      const sameProductsOnPurchase = productsToBuy.filter((product) => product.productId === productsToBuy[i].productId)
      console.log(sameProductsOnPurchase)
      let sumQuantity = 0
      for (const i of sameProductsOnPurchase) {
        // sumQuantity += sameProductsOnPurchase.quantity
      }
  }

    //depois popular tabela purchases pq é a compra finalizada
    const purchaseInCart = await db("purchases_products").where({purchase_id: purchaseId})
    
    let totalPrice = 0
    const newPurchase = {
      id: purchaseInCart[0].purchase_id, 
      buyer_id: buyerId,
      total_price: totalPrice
    }
    
    for (const i of purchaseInCart) {
      const [productInCart] = await db("products").where({id: i.product_id})
      totalPrice += i.quantity * productInCart.price
    }
    
    newPurchase.total_price = totalPrice 
    await db('purchases').insert(newPurchase)

    const [createdPurchase] = await db("purchases").where({id: purchaseId})

    let buyedProducts: {}[] = []
    for (const i of purchaseInCart) {
      const [productInCart] = await db("products").where({id: i.product_id})
      buyedProducts.push({
        name: productInCart.name,
        price: productInCart.price,
        quantity: i.quantity
      })
    }

    const stylizedPurchase = {
      purchaseId: createdPurchase.id,
      buyerId: createdPurchase.buyer_id,
      createdAt: createdPurchase.created_at,
      totalPrice: createdPurchase.total_price,
      paid: createdPurchase.paid,
      products: buyedProducts
    }

    buyedProducts = []

    res.status(201).send({
      message: "Compra cadastrada com sucesso",
      user: stylizedPurchase
    })

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

// Delete purchase by id - OK
app.delete('/purchases/:id', async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id
    if(idToDelete === ":id") {
      res.status(404)
      throw new Error('ERRO: Informe um id')
    }

    // >>>>Verificaçao se purchase existe
    const [foundId] = await db("purchases").where({id: idToDelete})
    if(foundId){
      await db("purchases").del().where({id: idToDelete})
      await db("purchases_products").del().where({purchase_id: idToDelete})
      res.status(200).send({messege: "Compra deletada com sucesso"})
    }else {
      res.status(404)
      throw new Error("ERRO: Compra não encontrada")
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

//purchase by id - OK
app.get('/purchases/:id', async (req: Request, res:Response) => {
  try {
    const id = req.params.id
    if(id === ":id"){
      res.status(404)
      throw new Error("Informe um Id")
    }

    const [foundPurchase] = await db('purchases').where({id})

    if(foundPurchase){
      const [buyer] = await db('users').where({id: foundPurchase.buyer_id})

      const stylizedPurchase = {
        purchaseId: foundPurchase.id,
        buyerId: foundPurchase.buyer_id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        createdAt: foundPurchase.created_at,
        totalPrice: foundPurchase.total_price,
        paid: foundPurchase.paid,
        products: [] as {}[]
      }

      const productsInPurchaseFound = await db('purchases_products').where({purchase_id: id})
      console.log(productsInPurchaseFound)

      for (const product of productsInPurchaseFound) {
        const [buyedProducts] = await db('products').where({id: product.product_id})
        stylizedPurchase.products.push({
          id: buyedProducts.id,
          name: buyedProducts.name,
          price: buyedProducts.price,
          description: buyedProducts.description,
          imageUrl: buyedProducts.image_url,
          quantity: product.quantity
        })
      }
      
      res.status(200).send(stylizedPurchase)
      
    }else{
      res.status(404)
      throw new Error("Compra não encontrada")
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

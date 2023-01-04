//node-packege.json
// console.log("funcionou")
// const teste = process.argv[2]

//typescriptI
// import {Users, Produtos, Purchase} from './database'

// console.table(Users)
// console.table(Produtos)
// console.table(Purchase)

//typescriptII
import {createUser, getAllUsers} from './database'

// createUser("novousuario", "novousuario@gmail.com", "novato")

// getAllUsers()

import {createProduct, 
        getAllProducts, 
        getProductById, 
        queryProductsByName, 
        createPurchase, 
        getAllPurchasesFromUserId
      } from './database'
import {Products} from './types'

createProduct("p5121", "anel", 284, Products.ACCESSORIES)

// getAllProducts()

// getProductById("p1055")
// getProductById("p10")

queryProductsByName("cadeira")
// queryProductsByName("monitor")

createPurchase("novousuario", "p5121", 2)
getAllPurchasesFromUserId("laisrmacedo")
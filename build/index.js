"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const types_1 = require("./types");
(0, database_1.createProduct)("p5121", "anel", 284, types_1.Products.ACCESSORIES);
(0, database_1.queryProductsByName)("cadeira");
(0, database_1.createPurchase)("novousuario", "p5121", 2);
(0, database_1.getAllPurchasesFromUserId)("laisrmacedo");
//# sourceMappingURL=index.js.map
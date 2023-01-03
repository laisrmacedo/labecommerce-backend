"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = exports.Produtos = exports.Users = void 0;
exports.Users = [
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
];
exports.Produtos = [
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
];
exports.Purchase = [
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
];
//# sourceMappingURL=database.js.map
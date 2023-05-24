const sqlite3 = require('sqlite3').verbose();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const productProtoPath = 'product.proto';
const shopProtoPath = 'shop.proto';
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const shopProtoDefinition = protoLoader.loadSync(shopProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;
const shopProto = grpc.loadPackageDefinition(shopProtoDefinition).shop;
const clientproducts = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());
const clientshops = new shopProto.ShopService('localhost:50056', grpc.credentials.createInsecure());


const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);


const resolvers = {
  Query: {
    shop: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM shops WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
    shops: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM shops', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    products: () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    },
    product: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        });
      });
    },
},
Mutation: {
    addshop: (_, { id,title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO shops (id,title, description) VALUES (?, ?, ?)', [id,title, description], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, description });
          }
        });
      });
    },
    addproduct: (_, { id,title, description }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO products (id,title, description) VALUES (?, ?, ?)', [id,title, description], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, description });
          }
        });
      });
    }
  },
};
module.exports = resolvers;

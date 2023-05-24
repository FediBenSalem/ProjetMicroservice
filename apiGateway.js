const sqlite3 = require('sqlite3').verbose();

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const productProtoPath = 'product.proto';
const shopProtoPath = 'shop.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

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


const app = express();
app.use(bodyParser.json());

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

  


const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
      );
  });


app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows)=> {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });

  app.post('/product', (req, res) => {
    const { id, title, description } = req.body;
    db.run(
      'INSERT INTO products (id, title, description) VALUES (?, ?, ?)',
      [id, title, description],
      function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({ id, title, description });
        }
    });
  })
  
  app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send('product not found.');
      }
    });
  });

  app.post('/shop', (req, res) => {
    const { id, title, description } = req.body;
    db.run(
      'INSERT INTO shops (id, title, description) VALUES (?, ?, ?)',
      [id, title, description],
      function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({ id, title, description });
        }
    });
  })

  
  app.get('/shops', (req, res) => {
    db.all('SELECT * FROM shops', (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });
  
  app.get('/shops/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM shops WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).send('shop not found.');
      }
    });
  });


const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});

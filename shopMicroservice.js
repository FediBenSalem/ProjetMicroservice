const sqlite3 = require('sqlite3').verbose();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const shopProtoPath = 'shop.proto';
const shopProtoDefinition = protoLoader.loadSync(shopProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const shopProto = grpc.loadPackageDefinition(shopProtoDefinition).shop;
const db = new sqlite3.Database('./database.db'); 

db.run(`
  CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )
`);


const shopService = {
  getshop: (call, callback) => {
    const { shop_id } = call.request;
    
    db.get('SELECT * FROM shops WHERE id = ?', [shop_id], (err, row) => {
      if (err) {
        callback(err);
      } else if (row) {
        const shop = {
          id: row.id,
          title: row.title,
          description: row.description,
        };
        callback(null, { shop });
      } else {
        callback(new Error('shop not found'));
      }
    });
  },
  searchshops: (call, callback) => {
    db.all('SELECT * FROM shops', (err, rows) => {
      if (err) {
        callback(err);
      } else {
        const shops = rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
        }));
        callback(null, { shops });
      }
    });
  },
  Createshop: (call, callback) => {
    const { shop_id, title, description } = call.request;
    db.run(
      'INSERT INTO shops (id, title, description) VALUES (?, ?, ?)',
      [shop_id, title, description],
      function (err) {
        if (err) {
          callback(err);
        } else {
          const shop = {
            id: shop_id,
            title,
            description,
          };
          callback(null, { shop });
        }
      }
    );
  },
};



const server = new grpc.Server();
server.addService(shopProto.ShopService.service, shopService);
const port = 50056;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`shop microservice running on port ${port}`);

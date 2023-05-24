# ProjetMicroservice

GraphQL API Gateway with SQLite and gRPC Integration

## Description

This project is a GraphQL API gateway that integrates SQLite as the database and uses gRPC for communication with other microservices. It provides endpoints for managing products and shops.

The project uses the following technologies:

- SQLite3: A lightweight and embedded database management system.
- Express.js: A fast and minimalist web application framework for Node.js.
- Apollo Server: A GraphQL server implementation for Node.js.
- gRPC: A high-performance, open-source framework for remote procedure calls (RPC).
- Protobuf: A language-agnostic interface definition language used for serializing structured data.
- Body Parser: Middleware for parsing JSON request bodies.
- CORS: Middleware for enabling Cross-Origin Resource Sharing.

## Features

- Retrieve a list of products and shops.
- Add new products and shops to the database.
- Retrieve a specific product or shop by ID.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repository
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Access the API via `http://localhost:3000`.

## API Routes

The following API routes are available:

- `GET /products`: Retrieve all products.
- `POST /product`: Add a new product.
- `GET /products/:id`: Retrieve a specific product by ID.
- `POST /shop`: Add a new shop.
- `GET /shops`: Retrieve all shops.
- `GET /shops/:id`: Retrieve a specific shop by ID.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your branch.
5. Submit a pull request.

Please ensure that your code adheres to the existing coding style and conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Support

If you have any questions or need assistance, feel free to [open an issue](https://github.com/your-username/your-repository/issues) on the repository.
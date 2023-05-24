const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Product {
    id: String!
    title: String!
    description: String!
  }

  type Shop {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    product(id: String!): Product
    products: [Product]
    shop(id: String!): Shop
    shops: [Shop]
  }
  type Mutation {
    addproduct(id: String!, title: String!, description:String!): Product
    addshop(id: String!, title: String!, description:String!): Shop
    
  }
`;

module.exports = typeDefs
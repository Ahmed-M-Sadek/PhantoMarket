import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: String!
    name: String
    email: String!
    emailVerified: String
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: String!
    name: String!
    imageUrl: String!
    products: [Product!]!
    discountEvents: [DiscountEvent!]!
  }

  type Product {
    id: String!
    name: String!
    description: String!
    price: Float!
    thumbnail: String!
    images: [String!]!
    category: Category!
    discountEvents: [DiscountEvent!]!
  }

  type DiscountEvent {
    id: String!
    discountPercentage: Float!
    startDate: String!
    endDate: String!
    products: [Product!]!
    categories: [Category!]!
  }

  type Query {
    users: [User!]!
    categories: [Category!]!
    products: [Product!]!
    discountEvents: [DiscountEvent!]!
    category(id: String!): Category
    product(id: String!): Product
    discountEvent(id: String!): DiscountEvent
  }

  type Mutation {
    createUser(
      email: String!
      name: String
      password: String!
      imageUrl: String
    ): User!
    createCategory(name: String!, imageUrl: String!): Category!
    createProduct(
      name: String!
      description: String!
      price: Float!
      thumbnail: String!
      images: [String!]!
      categoryId: String!
    ): Product!
    createDiscountEvent(
      discountPercentage: Float!
      startDate: String!
      endDate: String!
      productIds: [String!]!
      categoryIds: [String!]!
    ): DiscountEvent!
  }
`;

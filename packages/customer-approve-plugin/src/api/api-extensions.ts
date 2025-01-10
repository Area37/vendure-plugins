import gql from "graphql-tag";

const CustomerApproveAdminShopMutation = gql`
  extend type Mutation {
    switchApproveCustomer(customerId: ID!): Boolean!
  }
`;

export const adminApiExtensions = gql`
  ${CustomerApproveAdminShopMutation}
`;

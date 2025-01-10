import gql from "graphql-tag";

export const MUTATION_SWITCH_CUSTOMER = gql`
  mutation verifyCustomerAccount($customerId: ID!) {
    switchApproveCustomer(customerId: $customerId)
  }
`;

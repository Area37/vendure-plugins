import { addActionBarItem } from "@vendure/admin-ui/core";
import { firstValueFrom, map } from "rxjs";
import { ApolloCache } from "@apollo/client/cache";
import gql from "graphql-tag";

const mutation = gql`
  mutation verifyCustomerAccount($customerId: ID!) {
    switchApproveCustomer(customerId: $customerId)
  }
`;

export default [
  addActionBarItem({
    id: "approve-customer",
    locationId: "customer-detail",
    label: "Approve Customer",
    icon: "check-circle",
    buttonColor: "success",
    onClick: async (event, context) => {
      try {
        const customerId = context.route.snapshot.params.id;
        await firstValueFrom(
          context.dataService.mutate(
            mutation,
            { customerId },
            (cache: ApolloCache<any>) => {
              cache.evict({ fieldName: "user", id: `Customer:${customerId}` });
            },
          ),
        );
      } catch (error: any) {
        context.notificationService.error(
          "Error executing mutation: " + error.message,
        );
      }
    },
    requiresPermission: "ReadCustomer",
    buttonState: (context) => {
      return context.entity$.pipe(
        map((customer) => ({
          disabled: false,
          visible: customer?.user?.verified === false,
        })),
      );
    },
  }),
  addActionBarItem({
    id: "unapprove-customer",
    locationId: "customer-detail",
    label: "Reject Customer",
    icon: "exclamation-circle",
    buttonColor: "warning",
    onClick: async (event, context) => {
      try {
        const customerId = context.route.snapshot.params.id;
        await firstValueFrom(
          context.dataService.mutate(
            mutation,
            { customerId },
            (cache: ApolloCache<any>) => {
              cache.evict({ fieldName: "user", id: `Customer:${customerId}` });
            },
          ),
        );
      } catch (error: any) {
        context.notificationService.error(
          "Error executing mutation: " + error.message,
        );
      }
    },
    requiresPermission: "ReadCustomer",
    buttonState: (context) => {
      return context.entity$.pipe(
        map((customer) => ({
          disabled: false,
          visible: customer?.user?.verified === true,
        })),
      );
    },
  }),
];

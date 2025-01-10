import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Transaction } from "@vendure/core";
import { CustomerApproveService } from "../services/customer.approve.service";

@Resolver()
export class AdminCustomerApproveResolver {
  constructor(private b2BCustomer: CustomerApproveService) {}

  @Mutation()
  @Transaction()
  async switchApproveCustomer(
    @Ctx() ctx: RequestContext,
    @Args("customerId") customerId: string,
  ): Promise<boolean> {
    return this.b2BCustomer.switchApproveCustomer(ctx, customerId);
  }
}

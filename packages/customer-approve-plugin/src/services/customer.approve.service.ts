import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  CustomerService,
  UserService,
  User,
} from "@vendure/core";

@Injectable()
export class CustomerApproveService {
  constructor(
    private connection: TransactionalConnection,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
  ) {}

  async switchApproveCustomer(
    ctx: RequestContext,
    customerId: ID,
  ): Promise<boolean> {
    const customer = await this.customerService.findOne(ctx, customerId, [
      "user",
    ]);
    if (!customer) throw new Error("Customer not found");

    const { user } = customer;

    if (user instanceof User) {
      user.verified = !user?.verified;
      await this.connection
        .getRepository(ctx, User)
        .save(user, { reload: false });
      return !user?.verified;
    }

    return false;
  }
}

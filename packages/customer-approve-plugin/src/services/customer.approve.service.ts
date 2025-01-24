import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  CustomerService,
  UserService,
  HistoryService,
  EventBus,
  User,
  NATIVE_AUTH_STRATEGY_NAME,
  AccountVerifiedEvent
} from "@vendure/core";
import { HistoryEntryType } from "@vendure/common/lib/generated-types";

@Injectable()
export class CustomerApproveService {
  constructor(
    private connection: TransactionalConnection,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly historyService: HistoryService,
    private readonly eventBus: EventBus,
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

      if (user.verified) {
        await this.historyService.createHistoryEntryForCustomer({
          customerId: customer.id,
          ctx,
          type: HistoryEntryType.CUSTOMER_VERIFIED,
          data: {
            strategy: NATIVE_AUTH_STRATEGY_NAME,
          },
        });
        await this.eventBus.publish(new AccountVerifiedEvent(ctx, customer));
      }
      return !user?.verified;
    }

    return false;
  }
}

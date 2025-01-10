import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import path from "path";
import { CustomerApproveService } from "./services/customer.approve.service";
import { AdminCustomerApproveResolver } from "./api/customer.approve.resolver";
import { adminApiExtensions } from "./api/api-extensions";
import { PluginInitOptions } from "./types";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CustomerApproveService],
  compatibility: "^3.0.0",
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [AdminCustomerApproveResolver],
  },
})
export class CustomerApprovePlugin {
  static options: PluginInitOptions;

  static ui: AdminUiExtension = {
    id: "b2b-customer-ui",
    extensionPath: path.join(__dirname, "ui"),
    providers: ["providers.ts"],
  };

  static init(options: PluginInitOptions) {
    this.options = options;
    return CustomerApprovePlugin;
  }
}

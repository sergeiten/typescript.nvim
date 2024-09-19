import { setupCommands } from "@ts/commands";
import { config, ConfigOptions } from "@ts/config";
import { renameHandler } from "@ts/handlers";
import { TypescriptMethods } from "@ts/types/methods";
import { ts_ls } from "lspconfig";

export const setupLsp = (overrides?: ConfigOptions): void => {
  const resolvedConfig = { ...config, ...(overrides || {}) };
  const { on_init, on_attach, handlers } = resolvedConfig.server;

  resolvedConfig.server.on_init = (client, initialize_result): void => {
    on_init?.(client, initialize_result);
  };

  resolvedConfig.server.on_attach = (client, bufnr): void => {
    if (!config.disable_commands) {
      setupCommands(bufnr);
    }

    on_attach?.(client, bufnr);
  };

  resolvedConfig.server.handlers = {
    ...(handlers || {}),
    [TypescriptMethods.RENAME]:
      handlers?.[TypescriptMethods.RENAME] ?? renameHandler,
  };

  ts_ls.setup(resolvedConfig.server);
};

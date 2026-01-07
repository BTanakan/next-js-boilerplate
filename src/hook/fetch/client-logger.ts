import { CLIENT_LOGGER_API } from "@/lib/constants";

export const clientLogger = (body: unknown) =>
  fetch(CLIENT_LOGGER_API, { method: "POST", body: JSON.stringify(body) });

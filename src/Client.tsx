import { Client, ClientUser } from "fosscord.js";

const client = new Client({ intents: [] });
export default client;

// @ts-ignore
globalThis.client = client;
console.log(client);

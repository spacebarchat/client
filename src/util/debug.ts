// @ts-nocheck
import client from "../Client";

client.on("ready", () => {
  globalThis.guild = client.guilds.cache.first();
  globalThis.guilds = client.guilds.cache;
});

// @ts-ignore
globalThis.client = client;

client.on("ready", () => console.log("ready " + client.user?.tag));
client.on("message", (msg: any) => console.log(msg.content));
client.on("raw", (event: any) => console.log(event));

// @ts-nocheck
import client from "../client";

client.on("ready", () => {
	globalThis.guild = client.guilds.cache.first();
	globalThis.guilds = client.guilds.cache;
});

// @ts-ignore
globalThis.client = client;
console.log(client);

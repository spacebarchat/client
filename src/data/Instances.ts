import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { createContext } from "react";
import request from "../util/request";
import { initData } from "./Data";

export interface Instance {
	name: string;
	url?: string;
	description?: string;
	image?: string;
	official?: boolean;
}

const defaultInstances = [
	{
		name: "Discord",
		url: "https://discord.com",
		image: "https://logodownload.org/wp-content/uploads/2017/11/discord-logo-0.png",
		official: true,
	},
] as Instance[];

export class Instances {
	cache = [] as Instance[];

	constructor() {
		makeAutoObservable(this);
		initData(this);
	}

	@action
	async load() {
		this.cache = [
			...defaultInstances,
			...(await request("https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json")),
		];
	}
}

export const InstancesContext = createContext(new Instances());

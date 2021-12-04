import { action, makeAutoObservable, toJS } from "mobx";
import { createContext } from "react";
import request from "../util/request";

export class Accounts {
	cache = [] as any[];

	constructor() {
		makeAutoObservable(this);
	}
}

export const AccountsContext = createContext(new Accounts());

// import {Globals} from '../constants/Globals';
// import useLogger from '../hooks/useLogger';
// import {DomainStore} from '../stores/DomainStore';

import AppStore from "../stores/AppStore";
import { Globals, RouteSettings } from "./Globals";

export default class REST {
	private app: AppStore;
	private headers: Record<string, string>;

	constructor(app: AppStore) {
		this.app = app;
		this.headers = {
			mode: "cors",
			"User-Agent": "Spacebar-Client/1.0",
			accept: "application/json",
			"Content-Type": "application/json",
		};
	}

	public setToken(token: string | null) {
		if (token) {
			this.headers.Authorization = token;
		} else {
			delete this.headers.Authorization;
		}
	}

	public static async getEndpointsFromDomain(
		url: URL,
	): Promise<RouteSettings | null> {
		let endpoints = await this.getInstanceDomains(url);
		if (endpoints) return { ...endpoints, wellknown: url.toString() };

		// get endpoints from .well-known
		let wellKnown;
		try {
			wellKnown = await fetch(`${url.origin}/.well-known/spacebar`)
				.then((x) => x.json())
				.then((x) => new URL(x.api));
		} catch (e) {
			return null;
		}

		// well-known was found
		endpoints = await this.getInstanceDomains(wellKnown);
		if (!endpoints) return null;
		return { ...endpoints, wellknown: url.toString() };
	}

	static async getInstanceDomains(
		url: URL,
	): Promise<Omit<RouteSettings, "wellknown"> | null> {
		try {
			const endpoints = await fetch(
				`${url.toString()}${
					url.pathname.includes("api") ? "" : "api"
				}/policies/instance/domains`,
			).then((x) => x.json());
			return {
				api: endpoints.apiEndpoint,
				gateway: endpoints.gateway,
				cdn: endpoints.cdn,
			};
		} catch (e) {
			return null;
		}
	}

	public static makeAPIUrl(
		path: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
	) {
		const url = new URL(`${Globals.routeSettings.api}${path}`);
		Object.entries(queryParams).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
		return url.toString();
	}

	public static makeCDNUrl(
		path: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
	) {
		const url = new URL(`${Globals.routeSettings.cdn}${path}`);
		Object.entries(queryParams).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
		return url.toString();
	}

	public async get<T>(
		path: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
	): Promise<T> {
		return new Promise((resolve, reject) => {
			const url = REST.makeAPIUrl(path, queryParams);
			//   this.logger.debug(`GET ${url}`);
			return fetch(url, {
				method: "GET",
				headers: this.headers,
			})
				.then((res) => res.json())
				.then(resolve)
				.catch(reject);
		});
	}

	public async post<T, U>(
		path: string,
		body?: T,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
	): Promise<U> {
		return new Promise((resolve, reject) => {
			const url = REST.makeAPIUrl(path, queryParams);
			console.debug(`POST ${url}; payload:`, body);
			return fetch(url, {
				method: "POST",
				headers: this.headers,
				body: body ? JSON.stringify(body) : undefined,
			})
				.then(async (res) => {
					if (res.ok) {
						resolve(await res.json());
					} else {
						// reject with json if content type is json
						if (
							res.headers
								.get("content-type")
								?.includes("application/json")
						) {
							return reject(await res.json());
						}

						// if theres content, reject with text
						if (res.headers.get("content-length") !== "0") {
							return reject(await res.text());
						}

						// reject with status code if theres no content
						return reject(res.statusText);
					}
				})
				.catch(reject);
		});
	}
}

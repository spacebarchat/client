import AppStore from "../stores/AppStore";
import QueuedMessage from "../stores/objects/QueuedMessage";
import { Globals } from "./Globals";
import Logger from "./Logger";
import { RouteSettings } from "./constants";

export default class REST {
	private readonly logger = new Logger("REST");
	private app: AppStore;
	private headers: Record<string, string>;

	constructor(app: AppStore) {
		this.app = app;
		this.headers = {
			mode: "cors",
			"User-Agent": "Spacebar-Client/1.0",
			accept: "application/json",
		};
	}

	public setToken(token: string | null) {
		if (token) {
			this.headers.Authorization = token;
		} else {
			delete this.headers.Authorization;
		}
	}

	public static async getEndpointsFromDomain(url: URL): Promise<RouteSettings> {
		try {
			return await this.getInstanceDomains(url, url);
		} catch (e) {
			// continue
		}

		// get endpoints from .well-known
		const wellKnown = await fetch(`${url.origin}/.well-known/spacebar`)
			.then((x) => x.json())
			.then((x) => new URL(x.api));

		// well-known was found
		return await this.getInstanceDomains(wellKnown, url);
	}

	static async getInstanceDomains(url: URL, knownas: URL): Promise<RouteSettings> {
		const endpoints = await fetch(
			`${url.toString()}${url.pathname.includes("api") ? "" : "api"}/policies/instance/domains`,
		).then((x) => x.json());
		return {
			api: endpoints.apiEndpoint,
			gateway: endpoints.gateway,
			cdn: endpoints.cdn,
			wellknown: knownas.toString(),
		};
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
			this.logger.debug(`POST ${url}; payload:`, body);
			return fetch(url, {
				method: "POST",
				headers: {
					...this.headers,
					"Content-Type": "application/json",
				},
				body: body ? JSON.stringify(body) : undefined,
			})
				.then(async (res) => {
					// handle json if content type is json
					if (res.headers.get("content-type")?.includes("application/json")) {
						const data = await res.json();
						if (res.ok) return resolve(data);
						else return reject(data);
					}

					// if theres content, handle text
					if (res.headers.get("content-length") !== "0") {
						const data = await res.text();
						if (res.ok) return resolve(data as U);
						else return reject(data as U);
					}

					if (res.ok) return resolve(res.status as U);
					else return reject(res.statusText);
				})
				.catch(reject);
		});
	}

	public async postFormData<U>(
		path: string,
		body: FormData,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
		msg?: QueuedMessage,
	): Promise<U> {
		return new Promise((resolve, reject) => {
			const url = REST.makeAPIUrl(path, queryParams);
			this.logger.debug(`POST ${url}; payload:`, body);
			const xhr = new XMLHttpRequest();
			if (msg) {
				// add abort callback
				msg.setAbortCallback(() => {
					this.logger.debug("[PostFormData]: Message called abort");
					xhr.abort();
					reject("aborted");
				});
				// add progress listener
				xhr.upload.addEventListener("progress", (e: ProgressEvent) => msg.updateProgress(e));
			}
			xhr.addEventListener("loadend", () => {
				// if success, resolve text or json
				if (xhr.status >= 200 && xhr.status < 300) {
					if (xhr.responseType === "json") return resolve(xhr.response);

					return resolve(JSON.parse(xhr.response));
				}

				// if theres content, reject with text
				if (xhr.getResponseHeader("content-length") !== "0") return reject(xhr.responseText);

				// reject with status code if theres no content
				return reject(xhr.statusText);
			});
			xhr.open("POST", url);
			// set headers
			Object.entries(this.headers).forEach(([key, value]) => {
				xhr.setRequestHeader(key, value);
			});
			xhr.send(body);
		});
	}

	public async delete(
		path: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryParams: Record<string, any> = {},
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const url = REST.makeAPIUrl(path, queryParams);
			this.logger.debug(`DELETE ${url}`);
			return (
				fetch(url, {
					method: "DELETE",
					headers: this.headers,
				})
					// .then((res) => res.json())
					.then(() => resolve())
					.catch(reject)
			);
		});
	}
}

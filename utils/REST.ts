import useLogger from "../hooks/useLogger";
import { RouteBases } from "./Endpoints";

export default class REST {
  private token?: string;
  private headers: Record<string, any>;
  private logger = useLogger("REST");

  constructor(token?: string) {
    this.token = token;

    this.headers = {
      mode: "cors",
      "User-Agent": `Fosscord-Client/1.0 (${process.platform} ${process.arch})`,
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: this.token,
    };
  }

  public static makeAPIUrl(path: string) {
    return `${RouteBases.api}${path}`;
  }

  public static makeCDNUrl(path: string) {
    return `${RouteBases.cdn}${path}`;
  }

  public setToken(token: string) {
    this.token = token;
    this.headers = {
      ...this.headers,
      Authorization: this.token,
    };
  }

  public async get<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path);
      this.logger.debug(`GET ${url}`);
      return fetch(url, {
        method: "GET",
        headers: this.headers,
      })
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
  }

  public async post<T, U>(path: string, body: T): Promise<U> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path);
      this.logger.debug(`POST ${url}; payload:`, body);
      return fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
  }
}

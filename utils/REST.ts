import { APIVersion, RouteBases } from "./Endpoints";

export default class REST {
  private token?: string;
  private headers: Record<string, any>;

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
    return `${RouteBases.api}/api/v${APIVersion}${path}`;
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
      return fetch(REST.makeAPIUrl(path), {
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
      return fetch(REST.makeAPIUrl(path), {
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

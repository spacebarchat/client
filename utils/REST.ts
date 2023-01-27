import wretch, { Wretch } from "wretch";

export default class REST {
  public baseUrl: string;
  private token?: string;
  public apiVersion: string;
  private wretch: Wretch;

  constructor(baseUrl: string, token?: string, apiVersion: string = "9") {
    this.baseUrl = baseUrl;
    this.token = token;
    this.apiVersion = apiVersion;

    this.wretch = wretch(`${baseUrl}/api/v9`, {
      headers: {
        mode: "cors",
        "User-Agent": `Fosscord-Client/1.0 (${process.platform} ${process.arch})`,
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    });
  }

  public setToken(token: string) {
    this.token = token;
    this.wretch.headers({ Authorization: token });
  }

  public async get<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return this.wretch.get(path).json(resolve).catch(reject);
    });
  }

  public async post<T, U>(path: string, body: T): Promise<U> {
    return new Promise((resolve, reject) => {
      return this.wretch.post(body, path).json(resolve).catch(reject);
    });
  }
}

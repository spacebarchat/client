export default class REST {
  public baseUrl: string;
  private token?: string;
  public apiVersion: string;
  private headers: Record<string, any>;

  constructor(baseUrl: string, token?: string, apiVersion: string = "9") {
    this.baseUrl = baseUrl;
    this.token = token;
    this.apiVersion = apiVersion;

    this.headers = {
      mode: "cors",
      "User-Agent": `Fosscord-Client/1.0 (${process.platform} ${process.arch})`,
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: this.token,
    };
  }

  public makeAPIUrl(path: string) {
    return `${this.baseUrl}/api/v${this.apiVersion}${path}`;
  }

  public makeCDNUrl(path: string) {
    return `${this.baseUrl}${path}`;
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
      return fetch(this.makeAPIUrl(path), {
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
      return fetch(this.makeAPIUrl(path), {
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

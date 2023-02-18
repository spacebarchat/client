import { reaction } from "mobx";
import { Globals } from "../constants/Globals";
import useLogger from "../hooks/useLogger";
import { DomainStore } from "../stores/DomainStore";

export default class REST {
  private readonly domain: DomainStore;
  private token: string | null = null;
  private headers: Record<string, any>;
  private logger = useLogger("REST");

  constructor(domain: DomainStore) {
    this.domain = domain;

    this.headers = {
      mode: "cors",
      "User-Agent": `Fosscord-Client/1.0`,
      accept: "application/json",
      "Content-Type": "application/json",
    };

    reaction(
      () => this.domain.account.token,
      (token) => {
        this.token = token;

        if (token) {
          this.headers["Authorization"] = token;
        } else {
          delete this.headers["Authorization"];
        }
      }
    );
  }

  public static makeAPIUrl(
    path: string,
    queryParams: Record<string, any> = {}
  ) {
    const url = new URL(`${Globals.routeSettings.api}${path}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  public static makeCDNUrl(
    path: string,
    queryParams: Record<string, any> = {}
  ) {
    const url = new URL(`${Globals.routeSettings.cdn}${path}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  public async get<T>(
    path: string,
    queryParams: Record<string, any> = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path, queryParams);
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

  public async post<T, U>(
    path: string,
    body: T,
    queryParams: Record<string, any> = {}
  ): Promise<U> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path, queryParams);
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

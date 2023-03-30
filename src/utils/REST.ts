import {Globals} from '../constants/Globals';
import useLogger from '../hooks/useLogger';
import {DomainStore} from '../stores/DomainStore';

export default class REST {
  private readonly domain: DomainStore;
  private headers: Record<string, any>;
  private logger = useLogger('REST');

  constructor(domain: DomainStore) {
    this.domain = domain;

    this.headers = {
      mode: 'cors',
      'User-Agent': 'Spacebar-Client/1.0',
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  public setToken(token: string | null) {
    if (token) {
      this.headers.Authorization = token;
    } else {
      delete this.headers.Authorization;
    }
  }

  public static makeAPIUrl(
    path: string,
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
    queryParams: Record<string, any> = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path, queryParams);
      this.logger.debug(`GET ${url}`);
      return fetch(url, {
        method: 'GET',
        headers: this.headers,
      })
        .then(res => res.json())
        .then(resolve)
        .catch(reject);
    });
  }

  public async post<T, U>(
    path: string,
    body?: T,
    queryParams: Record<string, any> = {},
  ): Promise<U> {
    return new Promise((resolve, reject) => {
      const url = REST.makeAPIUrl(path, queryParams);
      this.logger.debug(`POST ${url}; payload:`, body);
      return fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      })
        .then(async res => {
          if (res.ok) {
            resolve(await res.json());
          } else {
            // reject with json if content type is json
            if (res.headers.get('content-type')?.includes('application/json')) {
              return reject(await res.json());
            }

            // if theres content, reject with text
            if (res.headers.get('content-length') !== '0') {
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

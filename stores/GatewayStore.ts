import { action, makeObservable, observable } from "mobx";
import BaseStoreEventEmitter from "./BaseStoreEventEmitter";

const GATEWAY_VERSION = "9";
const GATEWAY_ENCODING = "json";

export default class GatewayStore extends BaseStoreEventEmitter {
  @observable private token?: string;
  @observable socket?: WebSocket;
  @observable sessionId?: string;
  private url?: string;

  constructor() {
    super();

    makeObservable(this);
  }
  /**
   * Starts connection to gateway
   */
  @action
  async connect(url: string, token: string) {
    this.url = url;
    this.token = token;
    this.socket = new WebSocket(this.url);

    this.setupListeners();
  }

  private setupListeners() {
    this.socket!.onopen = this.onopen;
    this.socket!.onmessage = this.onmessage;
    this.socket!.onerror = this.onerror;
    this.socket!.onclose = this.onclose;
  }

  private onopen = () => {
    console.debug("[Gateway] Connected");
  };

  private onmessage = (e: WebSocketMessageEvent) => {
    const data = JSON.parse(e.data);
    console.debug("[Gateway] Received", data);
    // this.emit("message", data);
  };

  private onerror = (e: Event) => {
    console.error("[Gateway] Socket Error", e);
  };

  private onclose = (e: WebSocketCloseEvent) => {
    console.debug("[Gateway] Closed", e);
  };
}

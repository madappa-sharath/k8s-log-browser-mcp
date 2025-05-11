import axios from "axios";
import type { AxiosInstance } from "axios";
import { JsonObject } from "./types";
import https from "node:https";

export const RESULTS_FETCH_SIZE = 50;
const SQL_ENDPOINT = "/_plugins/_sql";

let initializedCursorKeepAlive = false;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export class OpensearchClient {
  private readonly baseUrl: string;
  private readonly _axios: AxiosInstance;

  constructor(host: string, username: string, password: string) {
    this.baseUrl = host;
    let passwordToUse = "";
    try {
      //attempt to base64 decode password, users can pass base64 encoded passwords to not deal with special characters in password
      passwordToUse = atob(password);
    } catch (e) {
      passwordToUse = password;
    }
    this._axios = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username,
        password: passwordToUse,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      allowAbsoluteUrls: false,
    });
  }

  private async request(
    path: string,
    method = "GET",
    body: JsonObject | undefined = undefined
  ): Promise<object> {
    try {
      const { data } = await this._axios.request({
        method,
        url: path,
        data: method !== "GET" && body ? body : undefined,
      });
      return data;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.message, error.response?.status || 500);
      }
      throw error;
    }
  }

  /**
   * Cursors have a default keep alive time of 1m. This isn't enough time for LLMs to interact with this. Boost to 5m.
   * todo: use jdbc instead of rest api to intercat with open search
   */
  private async boostCursorKeepAlive() {
    if (!initializedCursorKeepAlive) {
      await this.request("/_plugins/_query/settings", "PUT", {
        transient: {
          "plugins.sql.cursor.keep_alive": "5m",
        },
      });
    }
  }

  async getSQLQueryResult(query: string) {
    await this.boostCursorKeepAlive(); //duct tape alert
    return await this.request(SQL_ENDPOINT, "POST", {
      query: query,
      fetch_size: RESULTS_FETCH_SIZE,
    });
  }

  async getSQLCursorResult(cursor: string) {
    return await this.request(SQL_ENDPOINT, "POST", {
      cursor,
    });
  }
}

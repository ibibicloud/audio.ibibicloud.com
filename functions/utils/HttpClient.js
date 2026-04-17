
import { PARAMS, HEADERS } from './config.js';

export class HttpClient {
    // 合并默认参数 + 传入参数
    static mergeParams(params = {}) {
        return { ...PARAMS, ...params };
    }

    // GET 请求
    static async get(url, params = {}, headers = {}) {
        const finalParams = this.mergeParams(params);
        const urlObj = new URL(url);

        Object.entries(finalParams).forEach(([k, v]) => {
            urlObj.searchParams.append(k, v);
        });

        const res = await fetch(urlObj.toString(), {
            method: "GET",
            headers: { ...HEADERS, ...headers }
        });

        return this.handleResponse(res);
    }

    // POST 请求
    static async post(url, data = {}, headers = {}) {
        const res = await fetch(url, {
            method: "POST",
            headers: { ...HEADERS, "Content-Type": "application/json", ...headers },
            body: JSON.stringify(data)
        });

        return this.handleResponse(res);
    }

    // 响应处理
    static async handleResponse(res) {
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await res.json()
            : await res.text();

        return {
            status: res.status,
            ok: res.ok,
            data
        };
    }
}
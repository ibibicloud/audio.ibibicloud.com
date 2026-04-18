
export class HttpClient
{
    /**
     * 合并默认参数
     * @param {object} params 业务参数
     * @return {object}
     */
    static mergeParams(params = {})
    {
        return { ...PARAMS, ...params };
    }

    /**
     * GET 请求
     * @param {string} url 请求地址
     * @param {object} params URL 参数
     * @param {object} headers 请求头
     * @return {Promise<object>}
     */
    static async get(url, params = {}, headers = {})
    {
        const finalParams = this.mergeParams(params);
        const urlObj = new URL(url);

        for ( const [k, v] of Object.entries(finalParams) )
        {
            urlObj.searchParams.append(k, v);
        }

        const res = await fetch(urlObj.toString(), {
            method: 'GET',
            headers: { ...HEADERS, ...headers }
        });

        return this.handleResponse(res);
    }

    /**
     * POST 请求
     * @param {string} url 请求地址
     * @param {object} data 提交数据
     * @param {object} headers 请求头
     * @return {Promise<object>}
     */
    static async post(url, data = {}, headers = {})
    {
        const res = await fetch(url, {
            method: 'POST',
            headers: { ...HEADERS, 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify(data)
        });

        return this.handleResponse(res);
    }

    /**
     * 响应结果处理
     * @param {Response} res 响应对象
     * @return {Promise<object>}
     */
    static async handleResponse(res)
    {
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
            ? await res.json()
            : await res.text();

        return {
            status: res.status,
            ok: res.ok,
            data: data
        };
    }
    
}
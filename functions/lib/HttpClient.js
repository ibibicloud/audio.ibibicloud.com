
/**
 * HTTP 客户端工具类
 * 封装了常用的 HTTP 请求方法，支持 GET、POST 请求
 * 使用静态方法，无需实例化，开箱即用
 * 
 * @example
 * // GET 请求
 * const res = await HttpClient.get('https://api.example.com/users')
 * if ( res.ok ) {
 *     console.log(res.data)
 * }
 * 
 * // POST 请求
 * const res = await HttpClient.post('https://api.example.com/users', { name: '张三' })
 */
export class HttpClient
{
    /** 默认请求头 */
    static DEFAULT_HEADERS = {
        'Accept': 'application/json'
    };

    /** 默认参数 */
    static DEFAULT_PARAMS = {};

    /**
     * 合并默认参数
     * @param {object} params 业务参数
     * @return {object} 合并后的参数对象
     * @private
     */
    static mergeParams(params = {})
    {
        return { ...this.DEFAULT_PARAMS, ...params };
    }

    /**
     * 合并默认请求头
     * @param {object} headers 业务请求头
     * @return {object} 合并后的请求头对象
     * @private
     */
    static mergeHeaders(headers = {})
    {
        return { ...this.DEFAULT_HEADERS, ...headers };
    }

    /**
     * 发送 GET 请求
     * @param {string} url 请求地址
     * @param {object} [params={}] URL 查询参数
     * @param {object} [headers={}] 自定义请求头
     * @return {Promise<object>} 返回统一格式的响应对象
     * 
     * @example
     * // 基础 GET 请求
     * const res = await HttpClient.get('https://api.example.com/users')
     * 
     * // 带参数的 GET 请求
     * const res = await HttpClient.get('https://api.example.com/users', {
     *     page: 1,
     *     size: 10
     * })
     */
    static async get(url, params = {}, headers = {})
    {
        try {
            const finalParams = this.mergeParams(params);
            const urlObj = new URL(url);

            // 将参数拼接到 URL 上
            for ( const [k, v] of Object.entries(finalParams) ) {
                if ( v !== undefined && v !== null ) {
                    urlObj.searchParams.append(k, String(v));
                }
            }

            const res = await fetch(urlObj.toString(), {
                method: 'GET',
                headers: this.mergeHeaders(headers)
            });

            return await this.handleResponse(res);
        } catch ( error ) {
            return this.handleError(error);
        }
    }

    /**
     * 发送 POST 请求
     * @param {string} url 请求地址
     * @param {object} [data={}] 要发送的数据
     * @param {object} [headers={}] 自定义请求头
     * @return {Promise<object>} 返回统一格式的响应对象
     * 
     * @example
     * // 发送 JSON 数据
     * const res = await HttpClient.post('https://api.example.com/users', {
     *     name: '张三',
     *     age: 25
     * })
     */
    static async post(url, data = {}, headers = {})
    {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: this.mergeHeaders({
                    'Content-Type': 'application/json',
                    ...headers
                }),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(res);
        } catch ( error ) {
            return this.handleError(error);
        }
    }

    /**
     * 处理 HTTP 响应结果
     * @param {Response} res Fetch API 响应对象
     * @return {Promise<object>} 统一格式的响应对象
     * @private
     */
    static async handleResponse(res)
    {
        const contentType = res.headers.get('content-type') || '';
        
        // 根据 Content-Type 自动解析响应数据
        let data;
        if ( contentType.includes('application/json') ) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        return {
            status: res.status,
            ok: res.ok,
            data: data
        };
    }

    /**
     * 处理请求错误
     * @param {Error} error 错误对象
     * @return {object} 统一格式的错误响应对象
     * @private
     */
    static handleError(error)
    {
        return {
            status: 0,
            ok: false,
            data: null,
            error: error.message
        };
    }
    
}
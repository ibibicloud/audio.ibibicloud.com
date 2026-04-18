
export class HttpResponse
{
    /**
     * 构造函数
     */
    constructor()
    {
        // 响应头
        this._headers = {
            'Content-Type': 'application/json; charset=utf-8'
        };
    }

    /**
     * 设置响应头
     * @param {string} key 头名称
     * @param {string} value 头内容
     * @return {HttpResponse}
     */
    header(key, value)
    {
        this._headers[key] = value;
        return this;
    }

    /**
     * 批量设置响应头
     * @param {object} headers
     * @return {HttpResponse}
     */
    withHeaders(headers)
    {
        this._headers = { ...this._headers, ...headers };
        return this;
    }

    /**
     * 设置 CORS 跨域
     * @param {string} allowedOrigin 允许的源
     * @return {HttpResponse}
     */
    cors(allowedOrigin = '*')
    {
        this._headers['Access-Control-Allow-Origin'] = allowedOrigin;
        this._headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        this._headers['Access-Control-Allow-Headers'] = 'Content-Type';
        return this;
    }

    /**
     * 成功响应
     * @param {any} data 数据
     * @param {string} msg 提示信息
     * @param {number} code 状态码
     * @return {Response}
     */
    success(data = [], msg = '操作成功', code = 200)
    {
        return this.json({
            code: code,
            msg: msg,
            data: data
        });
    }

    /**
     * 失败响应
     * @param {string} msg 错误信息
     * @param {number} code 状态码
     * @param {any} data 附加数据
     * @return {Response}
     */
    error(msg = '操作失败', code = 500, data = [])
    {
        return this.json({
            code: code,
            msg: msg,
            data: data
        });
    }

    /**
     * 直接返回 JSON 数据
     * @param {object} data
     * @param {number} httpCode HTTP 状态码
     * @return {Response}
     */
    json(data = {}, httpCode = 200)
    {
        return new Response(JSON.stringify(data), {
            status: httpCode,
            headers: this._headers
        });
    }

    /**
     * 重定向
     * @param {string} url 跳转地址
     * @param {number} code 301/302
     * @return {Response}
     */
    redirect(url, code = 302)
    {
        return new Response(null, {
            status: code,
            headers: { ...this._headers, Location: url }
        });
    }

    /**
     * 空响应 204
     * @return {Response}
     */
    empty()
    {
        return new Response(null, {
            status: 204,
            headers: this._headers
        });
    }

    /**
     * 纯文本响应
     * @param {string} content 内容
     * @param {number} httpCode 状态码
     * @return {Response}
     */
    text(content, httpCode = 200)
    {
        return new Response(String(content), {
            status: httpCode,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
    
}
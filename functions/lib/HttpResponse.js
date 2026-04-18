
/**
 * HTTP 响应封装类
 * 用于 Cloudflare Pages 环境，封装 JSON、文本、重定向、CORS 等响应类型
 * 支持链式调用，方便设置响应头
 */
export class HttpResponse
{
    /**
     * 构造函数
     * 初始化默认响应头为 JSON 格式
     */
    constructor()
    {
        /** @type {object} 响应头对象 */
        this._headers = {
            'Content-Type': 'application/json; charset=utf-8'
        };
    }

    /**
     * 设置单个响应头
     * @param {string} key 响应头名称
     * @param {string} value 响应头值
     * @return {HttpResponse} 返回自身，支持链式调用
     * 
     * @example
     * res.header('X-Custom', 'value').success({ id: 1 })
     */
    header(key, value)
    {
        this._headers[key] = value;
        return this;
    }

    /**
     * 批量设置响应头
     * @param {object} headers 响应头对象
     * @return {HttpResponse} 返回自身，支持链式调用
     * 
     * @example
     * res.withHeaders({
     *     'X-Version': '1.0',
     *     'X-Environment': 'production'
     * }).success({ id: 1 })
     */
    withHeaders(headers)
    {
        this._headers = { ...this._headers, ...headers };
        return this;
    }

    /**
     * 设置 CORS 跨域响应头
     * @param {string} allowedOrigin 允许的源，默认为 * 允许所有
     * @return {HttpResponse} 返回自身，支持链式调用
     * 
     * @example
     * // 允许所有域名访问
     * res.cors().success({ data: 'ok' })
     * 
     * // 只允许特定域名
     * res.cors('https://example.com').success({ data: 'ok' })
     */
    cors(allowedOrigin = '*')
    {
        this._headers['Access-Control-Allow-Origin'] = allowedOrigin;
        this._headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        this._headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
        return this;
    }

    /**
     * 成功响应（业务状态码 200）
     * @param {any} data 返回的数据，默认为 null
     * @param {string} msg 提示信息，默认为 '操作成功'
     * @param {number} code 业务状态码，默认为 200
     * @return {Response} Cloudflare Response 对象
     * 
     * @example
     * // 返回数据
     * return res.success({ id: 1, name: '张三' })
     * 
     * // 自定义提示信息
     * return res.success({ id: 1 }, '创建成功', 201)
     * 
     * // 只返回提示信息
     * return res.success(null, '操作成功')
     */
    success(data = null, msg = '操作成功', code = 200)
    {
        return this.json({
            code: code,
            msg: msg,
            data: data
        });
    }

    /**
     * 失败响应
     * @param {string} msg 错误信息，默认为 '操作失败'
     * @param {number} code 业务状态码，默认为 500
     * @param {any} data 附加数据，默认为 null
     * @return {Response} Cloudflare Response 对象
     * 
     * @example
     * // 简单错误
     * return res.error('参数错误')
     * 
     * // 自定义状态码
     * return res.error('资源未找到', 404)
     * 
     * // 带附加数据
     * return res.error('验证失败', 422, { field: 'email', message: '邮箱格式错误' })
     */
    error(msg = '操作失败', code = 500, data = null)
    {
        return this.json({
            code: code,
            msg: msg,
            data: data
        });
    }

    /**
     * 返回 JSON 格式响应
     * @param {object} data JSON 数据对象
     * @param {number} httpCode HTTP 状态码，默认为 200
     * @return {Response} Cloudflare Response 对象
     * 
     * @example
     * return res.json({ custom: 'data' }, 201)
     */
    json(data = {}, httpCode = 200)
    {
        return new Response(JSON.stringify(data), {
            status: httpCode,
            headers: this._headers
        });
    }

    /**
     * 重定向响应
     * @param {string} url 跳转地址（支持相对路径和绝对路径）
     * @param {number} code HTTP 状态码，301（永久重定向）或 302（临时重定向），默认 302
     * @return {Response} Cloudflare Response 对象
     * 
     * @example
     * // 临时重定向
     * return res.redirect('https://example.com')
     * 
     * // 永久重定向
     * return res.redirect('/new-page', 301)
     */
    redirect(url, code = 302)
    {
        return new Response(null, {
            status: code,
            headers: { ...this._headers, Location: url }
        });
    }

    /**
     * 空响应（无响应体）
     * 常用于 DELETE 成功、OPTIONS 预检请求等场景
     * @return {Response} Cloudflare Response 对象，HTTP 状态码为 204
     * 
     * @example
     * // 处理 OPTIONS 预检请求
     * if ( req.method === 'OPTIONS' ) {
     *     return res.cors().empty()
     * }
     * 
     * // 删除成功
     * return res.empty()
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
     * @param {string} content 文本内容
     * @param {number} httpCode HTTP 状态码，默认为 200
     * @return {Response} Cloudflare Response 对象
     * 
     * @example
     * // 返回普通文本
     * return res.text('Hello World')
     * 
     * // 返回错误文本
     * return res.text('Not Found', 404)
     */
    text(content, httpCode = 200)
    {
        return new Response(String(content), {
            status: httpCode,
            headers: { ...this._headers, 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

}
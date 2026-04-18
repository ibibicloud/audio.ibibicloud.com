
export class Request
{
    /**
     * 构造函数
     * @param {object} context Cloudflare Pages 上下文
     */
    constructor(context)
    {
        this.url = new URL(context.request.url);
        this.ctx = context;
        this.req = context.request;

        this._get = null;
        this._post = null;
        this._headers = null;
    }

    /**
     * 获取 GET 参数，支持类型转换
     * @param {string} key 参数名，支持 id/d、name/s 格式
     * @param {any} def 默认值
     * @return {any}
     */
    get(key, def = null)
    {
        if ( !this._get ) {
            this._get = Object.fromEntries(this.url.searchParams);
        }

        const value = this._get[key] ?? def;
        return this.__parseKey(key, value);
    }

    /**
     * 获取 POST 参数，支持类型转换
     * @param {string} key 参数名，支持 id/d、name/s 格式
     * @param {any} def 默认值
     * @return {Promise<any>}
     */
    async post(key, def = null)
    {
        if ( !this._post ) {
            try {
                this._post = await this.req.json();
            } catch {
                this._post = {};
            }
        }

        const value = this._post[key] ?? def;
        return this.__parseKey(key, value);
    }

    /**
     * 获取 GET/POST 参数（自动合并）
     * @param {string} key 参数名
     * @param {any} def 默认值
     * @return {Promise<any>}
     */
    async param(key, def = null)
    {
        const val = this.get(key);
        if ( val !== null ) {
            return val;
        }

        const postVal = await this.post(key);
        return postVal ?? def;
    }

    /**
     * 获取请求头
     * @param {string} key 请求头名称
     * @param {any} def 默认值
     * @return {any}
     */
    header(key, def = null)
    {
        if ( !this._headers ) {
            this._headers = {};
            for ( const [k, v] of this.req.headers ) {
                this._headers[k.toLowerCase()] = v;
            }
        }
        return this._headers[key.toLowerCase()] ?? def;
    }

    /**
     * 获取路由参数，如 /api/:id
     * @param {string} key 路由参数名
     * @param {any} def 默认值
     * @return {any}
     */
    route(key, def = null)
    {
        return this.ctx.params?.[key] ?? def;
    }

    /**
     * 获取客户端真实IP
     * @return {string}
     */
    get ip()
    {
        return this.header('cf-connecting-ip') || this.header('x-forwarded-for') || '0.0.0.0';
    }

    /**
     * 获取请求方法（GET/POST/PUT...）
     * @return {string}
     */
    get method()
    {
        return this.req.method.toUpperCase();
    }

    /**
     * 判断是否 POST 请求
     * @return {boolean}
     */
    isPost()
    {
        return this.method === 'POST';
    }

    /**
     * 判断是否 GET 请求
     * @return {boolean}
     */
    isGet()
    {
        return this.method === 'GET';
    }

    /**
     * 解析参数名，分离类型标识（如 id/d → id + d）
     * @param {string} key 原始参数名
     * @param {any} value 参数值
     * @return {any}
     */
    __parseKey(key, value)
    {
        if ( !key.includes('/') ) {
            return value;
        }

        const [name, type] = key.split('/', 2);
        return this.__typeTransform(value, type);
    }

    /**
     * 类型转换（TP5风格）
     * d=数字，s=字符串，b=布尔，f=浮点
     * @param {any} value 原始值
     * @param {string} type 类型标识
     * @return {any}
     */
    __typeTransform(value, type)
    {
        if ( value === null || value === undefined ) {
            return null;
        }

        switch ( type ) {
            case 'd':
                return parseInt(value, 10) || 0;
            case 'b':
                return Boolean(value);
            case 'f':
                return parseFloat(value) || 0.00;
            case 's':
                return String(value);
            default:
                return value;
        }
    }
    
}
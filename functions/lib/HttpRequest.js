
export class HttpRequest
{
    /**
     * 构造函数
     * @param {object} context Cloudflare Pages 上下文对象
     */
    constructor(context)
    {
        /** @type {URL} 请求URL对象 */
        this.url = new URL(context.request.url);
        
        /** @type {Request} 原始请求对象 */
        this.req = context.request;
        
        /** @type {object|null} 缓存的GET参数 */
        this._get = null;
        
        /** @type {object|null} 缓存的POST参数 */
        this._post = null;
        
        /** @type {object|null} 缓存的请求头 */
        this._headers = null;
    }

    /**
     * 获取请求方法（返回大写格式）
     * @return {string} 请求方法（GET、POST、PUT、DELETE等）
     * 
     * @example
     * req.method  // 'GET'
     */
    get method()
    {
        return this.req.method.toUpperCase();
    }

    /**
     * 获取 GET 参数
     * @param {string} [key] 参数名，支持 id/d 格式进行类型转换，不传则返回所有参数
     * @param {any} [def] 默认值，当参数不存在时返回
     * @return {any} 参数值，类型根据 key 中的标识自动转换
     * 
     * @example
     * // 获取单个参数
     * req.get('id')        // 返回字符串 '123'
     * req.get('id/d')      // 返回数字 123
     * req.get('name/s')    // 返回字符串 '张三'
     * req.get('status/b')  // 返回布尔值 true/false
     * 
     * // 获取所有参数
     * const allParams = req.get()  // { id: '123', name: '张三' }
     */
    get(key, def = null)
    {
        // 首次调用时，将 URLSearchParams 转换为对象并缓存
        if ( !this._get ) {
            this._get = Object.fromEntries(this.url.searchParams);
        }

        // 不传参数，返回所有 GET 参数的副本
        if ( key === undefined ) {
            return { ...this._get };
        }

        // 获取参数值，不存在则使用默认值
        const value = this._get[key] ?? def;
        
        // 解析类型转换标识并返回
        return this._parseKey(key, value);
    }

    /**
     * 获取 POST 参数
     * @param {string} [key] 参数名，支持 id/d 格式进行类型转换，不传则返回所有参数
     * @param {any} [def] 默认值，当参数不存在时返回
     * @return {Promise<any>} 参数值，类型根据 key 中的标识自动转换
     * 
     * @example
     * // 获取单个参数
     * await req.post('id')        // 返回字符串 '123'
     * await req.post('id/d')      // 返回数字 123
     * await req.post('name/s')    // 返回字符串 '张三'
     * 
     * // 获取所有参数
     * const allParams = await req.post()  // { id: '123', name: '张三' }
     */
    async post(key, def = null)
    {
        // 首次调用时，解析请求体并缓存
        if ( !this._post ) {
            try {
                // 尝试解析为 JSON 格式
                // req.json() 将 JSON 字符串转换为 JavaScript 对象
                // 例如：'{"name":"张三","age":25}' → { name: '张三', age: 25 }
                this._post = await this.req.json();
            } catch {
                try {
                    // JSON 解析失败，尝试解析为表单格式
                    // req.formData() 将表单数据转换为 FormData 对象
                    // Object.fromEntries() 将 FormData 转换为普通对象
                    const formData = await this.req.formData();
                    this._post = Object.fromEntries(formData);
                } catch {
                    // 都不是则返回空对象
                    this._post = {};
                }
            }
        }

        // 不传参数，返回所有 POST 参数的副本
        if ( key === undefined ) {
            return { ...this._post };
        }

        // 获取参数值，不存在则使用默认值
        const value = this._post[key] ?? def;
        
        // 解析类型转换标识并返回
        return this._parseKey(key, value);
    }

    /**
     * 获取请求头
     * @param {string} [key] 请求头名称（不区分大小写），不传则返回所有请求头
     * @param {any} [def] 默认值，当请求头不存在时返回
     * @return {any} 请求头值
     * 
     * @example
     * // 获取单个请求头
     * req.header('content-type')  // 'application/json'
     * req.header('user-agent')    // 'Mozilla/5.0...'
     * 
     * // 获取所有请求头
     * const allHeaders = req.header()  // { 'content-type': 'application/json', ... }
     */
    header(key, def = null)
    {
        // 首次调用时，遍历所有请求头并缓存（统一转为小写键名）
        if ( !this._headers ) {
            this._headers = {};
            for ( const [k, v] of this.req.headers ) {
                this._headers[k.toLowerCase()] = v;
            }
        }

        // 不传参数，返回所有请求头的副本
        if ( key === undefined ) {
            return { ...this._headers };
        }

        // 获取请求头值，不存在则使用默认值
        return this._headers[key.toLowerCase()] ?? def;
    }

    /**
     * 获取客户端真实IP
     * @return {string} 客户端IP地址，优先获取 Cloudflare 的 cf-connecting-ip
     * 
     * @example
     * const clientIp = req.ip  // '192.168.1.1'
     */
    get ip()
    {
        // 优先级：Cloudflare IP → X-Forwarded-For → X-Real-IP → 默认值
        return this.header('cf-connecting-ip') || 
               this.header('x-forwarded-for')?.split(',')[0] || 
               this.header('x-real-ip') || 
               '0.0.0.0';
    }

    /**
     * 解析参数名，分离类型标识
     * @param {string} key 原始参数名（可能包含 /d、/s 等类型标识）
     * @param {any} value 原始参数值
     * @return {any} 转换后的参数值
     * @private
     * 
     * @example
     * // key = 'id/d', value = '123' → 调用 _typeTransform('123', 'd') → 123
     * // key = 'name', value = '张三' → 直接返回 '张三'
     */
    _parseKey(key, value)
    {
        // 如果 key 中不包含 '/'，说明没有类型标识，直接返回原值
        if ( !key.includes('/') ) {
            return value;
        }

        // 分离参数名和类型标识，例如 'id/d' → name='id', type='d'
        const [name, type] = key.split('/', 2);
        
        // 调用类型转换方法
        return this._typeTransform(value, type);
    }

    /**
     * 类型转换（ThinkPHP风格）
     * @param {any} value 原始值
     * @param {string} type 类型标识
     * @return {any} 转换后的值
     * @private
     * 
     * 支持的类型标识：
     * - d：整数
     * - b：布尔值（true/1 转换为 true，其他为 false）
     * - f：浮点数
     * - s：字符串
     * 
     * @example
     * _typeTransform('123', 'd')     // 123
     * _typeTransform('1', 'b')        // true
     * _typeTransform('3.14', 'f')     // 3.14
     * _typeTransform(123, 's')        // '123'
     */
    _typeTransform(value, type)
    {
        // 空值直接返回 null
        if ( value === null || value === undefined ) {
            return null;
        }

        switch ( type ) {
            case 'd':  // 整数
                return parseInt(value, 10) || 0;
            case 'b':  // 布尔值
                return value === 'true' || value === '1' || value === true;
            case 'f':  // 浮点数
                return parseFloat(value) || 0;
            case 's':  // 字符串
                return String(value);
            default:   // 未知类型，返回原值
                return value;
        }
    }
    
}
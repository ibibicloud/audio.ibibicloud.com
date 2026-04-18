
import { HttpRequest } from '../../lib/HttpRequest.js';
import { HttpResponse } from '../../lib/HttpResponse.js';

export async function onRequest(context)
{
    const req = new HttpRequest(context);
    const res = new HttpResponse();
    const type = req.get('type/s', '');

    // 1. 获取 GET 参数演示
    if ( type === 'get' ) {
        return res.success({
            message: '📥 演示获取 GET 参数',
            single_param: {
                id: req.get('id/d', 0),
                name: req.get('name/s', '默认名称'),
                active: req.get('active/b', false)
            },
            all_params: req.get()
        }, '✅ GET 参数获取演示成功');
    }

    // 2. 获取 POST 参数演示
    if ( type === 'post' ) {
        const postData = await req.post();
        return res.success({
            message: '📤 演示获取 POST 参数',
            single_param: {
                user_id: await req.post('user_id/d', 0),
                user_name: await req.post('user_name/s', ''),
                is_admin: await req.post('is_admin/b', false)
            },
            all_params: postData
        }, '✅ POST 参数获取演示成功');
    }

    // 3. 获取请求头演示
    if ( type === 'header' ) {
        return res.success({
            message: '📋 演示获取请求头',
            single_headers: {
                user_agent: req.header('user-agent'),
                content_type: req.header('content-type'),
                authorization: req.header('authorization')
            },
            all_headers: req.header()
        }, '✅ 请求头获取演示成功');
    }

    // 4. 获取客户端 IP 演示
    if ( type === 'ip' ) {
        return res.success({
            message: '🌐 演示获取客户端 IP',
            ip: req.ip,
            cf_connecting_ip: req.header('cf-connecting-ip'),
            x_forwarded_for: req.header('x-forwarded-for'),
            x_real_ip: req.header('x-real-ip')
        }, '✅ IP 获取演示成功');
    }

    // 5. 请求方法演示
    if ( type === 'method' ) {
        return res.success({
            message: '🔧 演示获取请求方法',
            method: req.method,
            is_get: req.method === 'GET',
            is_post: req.method === 'POST',
            is_put: req.method === 'PUT',
            is_delete: req.method === 'DELETE'
        }, '✅ 请求方法获取演示成功');
    }

    // 6. 类型转换演示
    if ( type === 'convert' ) {
        const queryData = {
            id_demo: req.get('id/d', 0),
            price_f: req.get('price/f', 0),
            name_s: req.get('name/s', ''),
            flag_b: req.get('flag/b', false)
        };

        // 同时演示 POST 类型转换
        const postData = {
            post_id: await req.post('post_id/d', 0),
            post_price: await req.post('post_price/f', 0),
            post_name: await req.post('post_name/s', ''),
            post_flag: await req.post('post_flag/b', false)
        };

        return res.success({
            message: '🔄 演示参数类型转换',
            get_params: queryData,
            post_params: postData,
            type_rules: {
                '/d': '转换为整数',
                '/f': '转换为浮点数',
                '/s': '转换为字符串',
                '/b': '转换为布尔值'
            },
            example: '?id=123 → req.get("id/d") → 123 (数字)'
        }, '✅ 类型转换演示成功');
    }

    // 7. 完整请求信息演示
    if ( type === 'info' ) {
        return res.success({
            message: '📊 演示完整请求信息',
            request_info: {
                method: req.method,
                url: req.url.toString(),
                pathname: req.url.pathname,
                search: req.url.search,
                ip: req.ip,
                get_params: req.get(),
                post_params: await req.post(),
                headers: req.header()
            }
        }, '✅ 完整请求信息获取成功');
    }

    // 8. 参数不存在默认值演示
    if ( type === 'default' ) {
        return res.success({
            message: '🎯 演示参数默认值',
            demo: {
                exists_param: req.get('id/d', 100),
                not_exists_param: req.get('not_exists/d', 999),
                with_default_string: req.get('name/s', '默认字符串'),
                with_default_bool: req.get('active/b', true)
            },
            note: '参数不存在时返回设置的默认值'
        }, '✅ 默认值演示成功');
    }

    // 9. 空参数获取所有演示
    if ( type === 'all' ) {
        const allGet = req.get();
        const allPost = await req.post();
        
        return res.success({
            message: '📦 演示获取所有参数（不传 key）',
            all_get_params: allGet,
            all_post_params: allPost,
            get_count: Object.keys(allGet).length,
            post_count: Object.keys(allPost).length
        }, '✅ 获取所有参数成功');
    }

    // 10. 请求体原始内容演示（高级用法）
    if ( type === 'raw' ) {
        const clone = req.req.clone();
        const rawBody = await clone.text();
        
        return res.success({
            message: '📄 演示获取原始请求体',
            raw_body: rawBody,
            content_type: req.header('content-type'),
            content_length: rawBody.length
        }, '✅ 原始请求体获取成功');
    }

    // 11. 链式获取演示
    if ( type === 'chain' ) {
        const userId = req.get('user_id/d', 0);
        const userName = await req.post('user_name/s', '');
        const userAgent = req.header('user-agent');
        const clientIp = req.ip;
        
        return res.success({
            message: '⛓️ 演示链式获取请求信息',
            user: {
                id: userId,
                name: userName,
                ip: clientIp,
                user_agent: userAgent
            }
        }, '✅ 链式获取演示成功');
    }

    // 12. 综合业务场景演示
    if ( type === 'business' ) {
        // 模拟用户登录场景
        const token = req.header('authorization');
        const userId = req.get('user_id/d', 0);
        const action = await req.post('action/s', 'query');
        
        return res.success({
            message: '💼 演示业务场景',
            scene: '用户操作',
            auth: {
                has_token: !!token,
                token_preview: token ? token.substring(0, 20) + '...' : null
            },
            request: {
                user_id: userId,
                action: action,
                timestamp: Date.now()
            }
        }, '✅ 业务场景演示成功');
    }

    // 默认：返回所有用法说明
    return res.success({
        title: '🚀 HttpRequest 演示中心',
        description: '以下是所有可用的演示类型',
        available_types: [
            { type: 'get', description: '📥 GET 参数获取演示' },
            { type: 'post', description: '📤 POST 参数获取演示' },
            { type: 'header', description: '📋 请求头获取演示' },
            { type: 'ip', description: '🌐 客户端 IP 获取演示' },
            { type: 'method', description: '🔧 请求方法获取演示' },
            { type: 'convert', description: '🔄 参数类型转换演示' },
            { type: 'info', description: '📊 完整请求信息演示' },
            { type: 'default', description: '🎯 参数默认值演示' },
            { type: 'all', description: '📦 获取所有参数演示' },
            { type: 'raw', description: '📄 原始请求体演示' },
            { type: 'chain', description: '⛓️ 链式获取演示' },
            { type: 'business', description: '💼 业务场景演示' }
        ],
        usage: '✨ 使用方式：?type=get&id=123&name=张三',
        example: '/api/demo?type=get&id=123&name=张三',
        current_request: {
            method: req.method,
            url: req.url.toString(),
            ip: req.ip,
            get_params: req.get()
        }
    }, '🎉 HttpRequest 演示就绪');
    
}
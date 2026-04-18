
import { HttpRequest } from '../../lib/HttpRequest.js';
import { HttpResponse } from '../../lib/HttpResponse.js';

export async function onRequest(context)
{
    const req = new HttpRequest(context);
    const res = new HttpResponse();
    const type = req.get('type/s', '');

    // 1. JSON 响应演示
    if ( type === 'json' ) {
        return res.json({
            message: '🎉 演示 JSON 响应',
            data: { name: '张三', age: 25 },
            timestamp: Date.now()
        });
    }

    // 2. 成功响应演示
    if ( type === 'success' ) {
        return res.success(
            { id: 1, name: '张三', email: 'zhangsan@example.com' },  // data
            '✅ 演示成功响应 - 操作成功',                              // msg
            200                                                       // code
        );
    }

    // 3. 失败响应演示
    if ( type === 'error' ) {
        return res.error(
            '❌ 演示失败响应 - 参数错误',  // msg
            400,                          // code
            { field: 'username', message: '用户名不能为空' }  // data
        );
    }

    // 4. 重定向演示
    if ( type === 'redirect' ) {
        return res.redirect('https://www.cloudflare.com', 302);
    }

    // 5. 空响应演示
    if ( type === 'empty' ) {
        return res.empty();
    }

    // 6. 文本响应演示
    if ( type === 'text' ) {
        return res.text('📝 演示文本响应 - Hello World from Cloudflare Pages');
    }

    // 7. 响应头设置演示
    if ( type === 'header' ) {
        return res
            .header('X-Demo-Name', 'HttpResponse')
            .header('X-Demo-Version', '1.0.0')
            .header('X-Demo-Author', 'Cloudflare')
            .success(
                { message: '🔧 演示响应头设置', headers_set: ['X-Demo-Name', 'X-Demo-Version', 'X-Demo-Author'] },
                '✅ 响应头设置成功'
            );
    }

    // 8. CORS 跨域演示
    if ( type === 'cors' ) {
        return res
            .cors()
            .success(
                { message: '🌐 演示 CORS 跨域配置', cors_origin: '*', cors_methods: 'GET, POST, PUT, DELETE, OPTIONS', cors_headers: 'Content-Type' },
                '✅ CORS 已启用'
            );
    }

    // 9. 链式调用演示
    if ( type === 'chain' ) {
        return res
            .cors('https://example.com')
            .header('X-Chain-Demo', 'true')
            .header('X-Request-Time', String(Date.now()))
            .withHeaders({
                'X-Batch-1': 'value1',
                'X-Batch-2': 'value2'
            })
            .success(
                { message: '⛓️ 演示链式调用', methods_used: ['cors()', 'header()', 'withHeaders()', 'success()'] },
                '✅ 链式调用演示成功'
            );
    }

    // 10. 获取请求信息演示
    if ( type === 'request' ) {
        return res.success(
            {
                message: '📋 演示获取请求信息',
                request_info: {
                    method: req.method,
                    url: req.url.toString(),
                    ip: req.ip,
                    user_agent: req.header('user-agent'),
                    get_params: req.get(),
                    all_headers: req.header()
                }
            },
            '✅ 请求信息获取成功'
        );
    }

    // 11. 错误码演示
    if ( type === '404' ) {
        return res.error(
            '🔍 演示 404 - 资源未找到',
            404,
            { path: req.url.pathname, suggestion: '请检查请求路径是否正确' }
        );
    }

    if ( type === '500' ) {
        return res.error(
            '💥 演示 500 - 服务器内部错误',
            500,
            { error_id: 'ERR_500_DEMO', retry_after: 5 }
        );
    }

    // 12. 不同数据格式演示
    if ( type === 'array' ) {
        return res.success(
            [
                { id: 1, name: '项目一' },
                { id: 2, name: '项目二' },
                { id: 3, name: '项目三' }
            ],
            '📦 演示数组数据返回'
        );
    }

    if ( type === 'empty_data' ) {
        return res.success([], '📭 演示空数据返回');
    }

    // 默认：返回所有用法说明
    return res.success(
        {
            title: '🚀 HttpResponse 演示中心',
            description: '以下是所有可用的演示类型',
            available_types: [
                { type: 'json', description: '📄 JSON 响应演示' },
                { type: 'success', description: '✅ 成功响应演示' },
                { type: 'error', description: '❌ 失败响应演示' },
                { type: 'redirect', description: '🔄 重定向演示' },
                { type: 'empty', description: '📭 空响应演示' },
                { type: 'text', description: '📝 文本响应演示' },
                { type: 'header', description: '🔧 响应头设置演示' },
                { type: 'cors', description: '🌐 CORS 跨域演示' },
                { type: 'chain', description: '⛓️ 链式调用演示' },
                { type: 'request', description: '📋 请求信息演示' },
                { type: '404', description: '🔍 404 错误演示' },
                { type: '500', description: '💥 500 错误演示' },
                { type: 'array', description: '📦 数组数据演示' },
                { type: 'empty_data', description: '📭 空数据演示' }
            ],
            usage: '✨ 使用方式：?type=success',
            example: '/api/demo?type=success',
            current_request: {
                method: req.method,
                url: req.url.toString(),
                ip: req.ip
            }
        },
        '🎉 HttpResponse 演示就绪'
    );

}
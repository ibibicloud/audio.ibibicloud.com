
import { Request } from '../lib/Request.js';
import { Response } from '../lib/Response.js';
import { HttpClient } from '../lib/HttpClient.js';

export async function onRequestGet(context)
{
    // 实例化
    const request  = new Request(context);
    const response = new Response();

    try {
        // 测试调用：ip-api.com （免费、公开、不需要任何 Headers/Params）
        const result = await HttpClient.get('http://ip-api.com/json/104.28.165.129');

        // 返回结果
        return response.success(result.data, '测试接口调用成功');

    } catch (err) {
        console.error('测试报错：', err);
        return response.error('测试失败：' + err.message);
    }
}
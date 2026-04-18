
import { HttpRequest } from '../../lib/HttpRequest.js';
import { HttpResponse } from '../../lib/HttpResponse.js';
import { HttpClient } from '../../lib/HttpClient.js';

export async function onRequestGet(context)
{
    // 实例化
    const req = new HttpRequest(context);
    const res = new HttpResponse();

    try {
        // 测试调用：ip-api.com （免费、公开、不需要任何 Headers/Params）
        const result = await HttpClient.get('http://ip-api.com/json/104.28.165.129');

        // 返回结果
        return res.success(result.data, '测试接口调用成功');

    } catch ( err ) {
        console.error('测试报错：', err);
        return res.error('测试失败：' + err.message);
    }
}
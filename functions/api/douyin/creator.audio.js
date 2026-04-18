import { HttpRequest } from '../../lib/HttpRequest.js';
import { HttpResponse } from '../../lib/HttpResponse.js';
import { HttpClient } from '../../lib/HttpClient.js';
import { PARAMS, HEADERS } from '../../config/douyin.js';

export async function onRequestGet(context)
{
    // 实例化请求响应
    const req = new HttpRequest(context);
    const res = new HttpResponse();

    // 类型配置
    const typeData = {
        '推荐': { type: 'recommend', category_id: '1' },
        '热门榜': { type: 'rank', category_id: '7088298745502646280' },
        '飙升榜': { type: 'rank', category_id: '708297994563059748' },
        '原创榜': { type: 'rank', category_id: '6854399861215747336' },
        '卡点': { type: 'category', category_id: '7395823327471782694' },
        '纯音乐': { type: 'category', category_id: '7397340776264420134' },
        '旅行': { type: 'category', category_id: '7397321654973549338' },
        'DJ': { type: 'category', category_id: '7395861511152864050' },
        '搞笑': { type: 'category', category_id: '7397653031963167526' },
        '流行': { type: 'category', category_id: '7397326893978405683' },
        '伤感': { type: 'category', category_id: '7397328346998213386' }
    };

    // 获取参数
    const type = req.get('type/s', '推荐');
    const page = req.get('page/d', 1);

    // 获取当前分类
    const currentType = typeData[type] || typeData['推荐'];

    // 合并参数：业务参数 + 抖音公共参数
    const queryData = {
        ...PARAMS,
        type: currentType.type,
        category_id: currentType.category_id,
        cursor: (page - 1) * 20,
        count: 20
    };

    // 发起请求（HttpClient 已内置错误处理，不会抛出异常）
    const result = await HttpClient.get(
        'https://creator.douyin.com/web/api/media/music/list',
        queryData,
        HEADERS
    );

    // 判断请求结果
    if ( result.ok ) {
        // 返回数据时，可以附带下一页的 cursor
        const responseData = {
            list: result.data,
            cursor: result.data?.cursor || 0,
            has_more: result.data?.has_more || false
        };
        
        return res.success(responseData, '获取成功');
    } else {
        console.error('抖音接口报错：', result.error);
        return res.error('请求失败：' + result.error, result.status);
    }
}
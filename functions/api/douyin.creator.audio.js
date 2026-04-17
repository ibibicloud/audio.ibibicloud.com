
import { HttpClient } from '../utils/HttpClient.js';

export async function onRequestGet(context) {
	const url = new URL(context.request.url);

    const typeData = {
    	'推荐': { type: 'recommend', category_id: '1' },
        '热门榜': { type: 'rank', category_id: '7088298745502646280' },
        // '收藏': { type: 'fav', category_id: '1' },
        '飙升榜': { type: 'rank', category_id: '708297994563059748' },
        '原创榜': { type: 'rank', category_id: '6854399861215747336' },
        '卡点': { type: 'category', category_id: '7395823327471782694' },
        '纯音乐': { type: 'category', category_id: '7397340776264420134' },
        '旅行': { type: 'category', category_id: '7397321654973549338' },
        'DJ': { type: 'category', category_id: '7395861511152864050' },
        '搞笑': { type: 'category', category_id: '7397653031963167526' },
        '流行': { type: 'category', category_id: '7397326893978405683' },
        '伤感': { type: 'category', category_id: '7397328346998213386' },
    };

    const type = url.searchParams.get('type') || '推荐';
    const page = url.searchParams.get('page') || 1;

    const currentType = typeData[type] || typeData['推荐'];

    const queryData = {
        type: currentType.type
        ,category_id: currentType.category_id
        ,cursor: (page - 1) * 20
        ,count: 20
    };

    const result = await HttpClient.get('https://creator.douyin.com/web/api/media/music/list', queryData);

    return Response.json({
        code: 0,
        data: result.data
    });
}
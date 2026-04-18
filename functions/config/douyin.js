
// 浏览器 请求参数
export const PARAMS = {
    // 可用可不用
    screen_width: '1920',
    screen_height: '1080',
    browser_language: 'zh-CN',
    browser_platform: 'Win32',
    browser_name: 'Chrome',
    browser_version: '146.0.0.0',
    browser_online: 'true',
    os_name: 'Windows',

    // 建议带上
    device_platform: 'webapp',
    channel: 'channel_pc_web',

    // 必须带上
    aid: '6383'
};

// 浏览器 模拟请求头
export const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
};
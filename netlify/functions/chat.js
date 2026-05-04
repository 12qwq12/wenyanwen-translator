exports.handler = async (event) => {
    // 只允许 POST 请求
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // 解析用户发来的消息
    let message;
    try {
        const body = JSON.parse(event.body);
        message = body.message;
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON' })
        };
    }

    if (!message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing message' })
        };
    }

    // 调用 Kimi API
    try {
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.KIMI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'moonshot-v1-8k',
                messages: [
                    { role: 'system', content: '你是初中文言文学习助手，擅长解释字词、翻译古文，耐心解答学生问题。' },
                    { role: 'user', content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '（AI 没有返回有效回复）';

        return {
            statusCode: 200,
            body: JSON.stringify({ reply })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'AI 请求失败', details: error.message })
        };
    }
};

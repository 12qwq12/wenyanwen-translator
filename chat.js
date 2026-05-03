// api/chat.js
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Missing message' });
    }

    try {
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.KIMI_API_KEY}`   // 从环境变量读取
            },
            body: JSON.stringify({
                model: 'moonshot-v1-8k',
                messages: [
                    { role: 'system', content: '你是初中文言文学习助手，擅长解释字词含义，耐心解答问题。' },
                    { role: 'user', content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。';
        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ error: 'AI 请求失败', details: error.message });
    }
}

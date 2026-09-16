// scripts/topic-tags.js — общие правила тематики для тегов новостей.
// Используется парсером (fetch-news.js) и ретегированием (retag-news.js).
const TOPIC_RULES = [
    { tag: 'безопасность', kw: ['взлом', 'уязвим', 'малвар', 'вредонос', 'хакер', 'атак', 'фишинг', 'утечк', 'ransomware', 'malware', 'vulnerab', 'breach', 'exploit', 'phishing', 'cyber', 'security', 'threat', 'backdoor', 'spyware'] },
    { tag: 'игры', kw: ['игр', 'game', 'steam', 'геймер', 'консол', 'playstation', 'xbox', 'nintendo'] },
    { tag: 'железо', kw: ['gpu', 'cpu', 'видеокарт', 'процессор', 'nvidia', 'radeon', 'rtx', 'ssd', 'dram', 'памят', 'чип', 'драйвер', 'geforce', 'ryzen'] },
    { tag: 'ИИ', kw: ['искусственный интеллект', 'нейросет', 'openai', 'gpt', 'claude', 'anthropic', 'gemini', 'llm', 'машинное обучение', 'deepseek'] },
    { tag: 'софт', kw: ['релиз', 'обновлен', 'верси', 'браузер', 'firefox', 'chrome', 'linux', 'ubuntu', 'windows', 'приложени', 'программ'] },
    { tag: 'сети', kw: ['интернет', 'сервер', 'ddos', 'домен', 'сайт', 'vpn', 'провайдер'] },
    { tag: 'мобильное', kw: ['android', 'ios', 'iphone', 'смартфон', 'мобильн'] },
    { tag: 'космос', kw: ['космос', 'spacex', 'starship', 'nasa', 'ракет', 'орбит', 'спутник'] },
];

function detectTopicTags(text) {
    const hay = (text || '').toLowerCase();
    const tags = [];
    for (const rule of TOPIC_RULES) {
        if (rule.kw.some(k => hay.includes(k))) tags.push(rule.tag);
        if (tags.length >= 2) break;
    }
    return tags;
}

module.exports = { TOPIC_RULES, detectTopicTags };

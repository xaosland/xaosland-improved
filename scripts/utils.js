// utils.js
const fs = require('fs');
const path = require('path');

// Маппинг категорий (используется во многих местах)
const categoryMap = {
    'Новости': 'news',
    'Статьи': 'articles',
    'Обучение': 'learning',
    'Пентестинг': 'pentest',
    'Windows': 'windows',
    'Программы': 'programs',
    'Игры': 'games',
    'Скрипты': 'scripts',
    'Обучение': 'learning',
    'Сети': 'networks',
    'GitHub проекты': 'github',
    'Ozon находки': 'ozon'
};

function getSlugFromCategory(category) {
    return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-');
}

function getCategoryFromSlug(slug) {
    for (const [cat, sl] of Object.entries(categoryMap)) {
        if (sl === slug) return cat;
    }
    return null;
}

// Экранирование XML
function escapeXML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function isSafeArticleId(id) {
    return typeof id === 'string' && /^[a-z0-9][a-z0-9-]{1,99}$/i.test(id);
}

module.exports = { getSlugFromCategory, getCategoryFromSlug, escapeXML, categoryMap, isSafeArticleId };
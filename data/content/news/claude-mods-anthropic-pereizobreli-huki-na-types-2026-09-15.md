---
id: claude-mods-anthropic-pereizobreli-huki-na-types-2026-09-15
category: Новости
title: Claude Mods: Anthropic переизобрели хуки на TypeScript
excerpt: Anthropic открыли ранний доступ к Claude Mods . Это плагины с хуками на TypeScript, которые меняют поведение и интерфейс Claude Code: перехватывают вызовы инструментов, обрабатывают результаты, добавляют панели и кнопки. Читать далее
date: 2026-09-15
readTime: 1
tags: [новости, технологии]
featured: false
popular: false
image: ""
metaTitle: Claude Mods: Anthropic переизобрели хуки на TypeScript
metaDescription: Anthropic открыли ранний доступ к Claude Mods . Это плагины с хуками на TypeScript, которые меняют поведение и интерфейс Claude Code: перехватывают вы
source: Habr
sourceUrl: https://habr.com/ru/news/1082502/?utm_source=habrahabr&utm_medium=rss&utm_campaign=1082502
---

Anthropic открыли ранний доступ к Claude Mods . Это плагины с хуками на TypeScript, которые меняют поведение и интерфейс Claude Code: перехватывают вызовы инструментов, обрабатывают результаты, добавляют панели и кнопки.
Вот полный список того, что и как можно перехватывать.
Например, этот хук (мод) замеряет время вызова Bash и показывает его в интерфейсе:
on("tool.call", { tool: "Bash" }, async ($, e, next) => { const start = $.clock.now(); const result = await next(e); // передаём вызов дальше $.ui.toast(`Bash: ${$.clock.now() - start} мс`); return result; });
Конечно, можно делать и более полезные вещи. Например, Anthropic показали в демо мод, который скрывает чувствительные данные и раскрывает их при наведении (видео).
Из готовых модов уже есть cc-pr-tracker , который показывает статусы PR прямо в Claude Code, и cctop с расходом токенов и заполнением контекста.
Сейчас это early access, моды ставятся через обычную систему плагинов, но для запуска нужен флаг CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 .
P.S. Конечно, сообщество сразу занялось самым важным: встроило тетрис прямо над строкой ввода, дыхательную гимнастику , ну и, куда же без Doom !
Если новость понравилась, приглашаю в канал AI for Devs . Каждый день публикую похожие материалы: новые модели, агенты, практические кейсы и новости из мира AI.

---

**Источник:** Habr — <https://habr.com/ru/news/1082502/?utm_source=habrahabr&utm_medium=rss&utm_campaign=1082502>
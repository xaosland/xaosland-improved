---
id: clickfix-lures-deploy-chainscript-rat-using-poly-2026-09-21
category: Новости
title: ClickFix Lures Развертывание ChainScript RAT с использованием Polygon для поворота инфраструктуры C2
excerpt: Злоумышленники используют приманки, подобные ClickFix, для доставки ранее недокументированного трояна удаленного доступа (RAT) под названием ChainScript. «ChainScript появился под несколькими названиями сборок, включая ComponentTask33, UpdateDigital,
date: 2026-09-21
readTime: 1
tags: [новости, безопасность]
featured: false
popular: false
image: /images/news/clickfix-lures-deploy-chainscript-rat-using-poly-2026-09-21.webp
metaTitle: ClickFix Lures Развертывание ChainScript RAT с использование
metaDescription: Злоумышленники используют приманки, подобные ClickFix, для доставки ранее недокументированного трояна удаленного доступа (RAT) под названием ChainScri
source: The Hacker News
sourceUrl: https://thehackernews.com/2026/09/clickfix-lures-deploy-chainscript-rat.html
---

Злоумышленники используют приманки, подобные ClickFix, для доставки ранее недокументированного трояна удаленного доступа (RAT) под названием ChainScript. «ChainScript появился под несколькими названиями сборок, включая ComponentTask33, UpdateDigital, HostShared и OrchidViolet66, одновременно представляя себя как программное обеспечение Spotify, Zoom Workplace и Microsoft Teams», — Blackpoint Adversary Pursuit Group (APG)
«ChainScript появился под несколькими названиями сборок, включая ComponentTask33, UpdateDigital, HostShared и OrchidViolet66, одновременно представляя себя как программное обеспечение Spotify, Zoom Workplace и Microsoft Teams», — рассказали исследователи Blackpoint Adversary Pursuit Group (APG) Сэм Декер, Энди Урсри и Неван Бил.
Как и многие семейства вредоносных программ, наблюдавшиеся в последние месяцы, ChainScript использует метод обнаружения командно-контрольного типа (C2) в стиле EtherHiding, который использует смарт-контракт Polygon для обнаружения своей активной инфраструктуры WebSocket.
ChainScript — это полнофункциональный RAT, который обеспечивает расширенный удаленный доступ оператору, включая интерактивные CMD и PowerShell, файловые операции, захват снимков экрана, развертывание полезной нагрузки, перечисление криптовалютных кошельков (как настольных приложений, так и расширений браузера) и удаленное выполнение JavaScript.
Отправной точкой цепочки атак является приманка ClickFix, которая приводит к загрузке и выполнению вредоносного установщика Windows с использованием «msiexec.exe». Установщик («ComponentTask33-4d14e6ac.msi»), замаскированный под Spotify, развертывает среду выполнения Node.js и запускает агент JavaScript ChainScript через скрытые этапы PowerShell и VBScript.
Сценарий PowerShell перемещает различные компоненты, а именно среду выполнения, источник агента, конфигурацию и другие вспомогательные двоичные файлы, по разным путям Microsoft в папке «%LOCALAPPDATA%». VBScript служит основным средством запуска ChainScript.
Затем работающий агент устанавливает постоянство на уровне пользователя с помощью запланированного задания с резервным ключом запуска реестра. После выполнения ChainScript подключается к серверу C2 через WebSockets и получает дополнительные задачи, предоставляя злоумышленнику прямой контроль над скомпрометированной системой. Поддерживаемые команды также позволяют ему самостоятельно обновляться и удалять постоянство.

---

**Источник:** The Hacker News — <https://thehackernews.com/2026/09/clickfix-lures-deploy-chainscript-rat.html>
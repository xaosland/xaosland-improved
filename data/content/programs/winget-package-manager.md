---
id: winget-package-manager
category: Программы
title: winget — магазин программ без магазина
excerpt: Одна команда ставит всё: браузер, редактор, утилиты. Официальный менеджер пакетов Windows, который экономит час на новом ПК.
date: 2026-09-16
readTime: 5
featured: false
popular: false
tags: [windows, утилиты, автоматизация]
image: ""
metaTitle: "winget — менеджер пакетов Windows"
metaDescription: "Как ставить и обновлять программы одной командой через winget: базовые команды и готовый список для нового ПК."
---

<h2>Новый ПК за 20 минут</h2>
<p>winget — официальный менеджер пакетов Microsoft. Вместо гуглить-скачать-далее-далее вы пишете команды, а установщик берёт пакеты из проверенного каталога. Обновления — одной строкой для всего софта.</p>

<h3>Четыре команды, которые заменяют всё</h3>
<p><code>winget search firefox</code> — найти пакет;<br>
<code>winget install Mozilla.Firefox</code> — поставить;<br>
<code>winget upgrade</code> — что устарело;<br>
<code>winget upgrade --all</code> — обновить всё сразу.</p>

<h3>Базовый набор для нового ПК</h3>
<p><code>winget install Mozilla.Firefox 7zip.7Zip VideoLAN.VLC voidtools.Everything Microsoft.PowerToys OBSProject.OBSStudio Git.Git Python.Python.3.12</code> — полминуты на строку, и рабочая машина готова. Сохраните свой список в файл — разворачивание на новом ПК станет делом одной команды.</p>

<h3>Экспорт и импорт списка</h3>
<p><code>winget export -o apps.json</code> выгружает всё установленное; <code>winget import apps.json</code> ставит обратно. Удобно между ПК или после переустановки системы.</p>

<h3>Вердикт</h3>
<p>Уже встроен в Windows 10/11. Если вы ставите программы руками — попробуйте один раз, и обратной дороги не будет.</p>

---
id: aircrack-own-wifi-lab
category: Обучение
title: Aircrack-ng: лаборатория аудита собственной Wi‑Fi сети
excerpt: Проверяем настройки своей тестовой точки доступа, снимаем только собственный трафик и оцениваем защиту без деавторизации чужих клиентов.
date: 2026-09-17
readTime: 14
featured: false
popular: false
tags: [aircrack-ng, wi-fi, аудит, лаборатория]
lab: true
labTools: [Aircrack-ng, iw, nmcli]
labLevel: Средний
image: ""
metaTitle: Aircrack-ng: лаборатория аудита собственной Wi‑Fi сети
metaDescription: Проверяем настройки своей тестовой точки доступа, снимаем только собственный трафик и оцениваем защиту без деавторизации чужих клиентов.
source: xaosland
sourceUrl: https://xaosland.ru/learning/aircrack-own-wifi-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Границы</h2><p>Нужны ваша точка доступа, ваш USB‑адаптер и тестовый клиент. Не применяйте deauth, не захватывайте чужие сети и не пытайтесь подбирать чужие пароли. Современная цель — проверить конфигурацию WPA2/WPA3 и качество собственного пароля, а не «взломать Wi‑Fi».</p><h2>1. Инвентаризация без мониторинга</h2><pre><code class="language-bash">sudo apt install -y aircrack-ng iw
nmcli device status
iw dev
nmcli connection show --active</code></pre><p>Запишите SSID, режим шифрования и MAC только своей точки. В панели роутера отключите WPS, включите WPA2‑AES/WPA3 и задайте длинную случайную фразу.</p><h2>2. Учебный захват своей сети</h2><p>Если вы используете мониторный режим, отключите NetworkManager только по инструкции дистрибутива и работайте на выделенном адаптере. В учебной записи выбирайте канал своей AP и только её BSSID:</p><pre><code class="language-bash"># пример: заменить wlan1 на свой адаптер и канал своей AP
sudo airmon-ng check kill
sudo airmon-ng start wlan1
sudo airodump-ng --bssid AA:BB:CC:DD:EE:FF --channel 6 --write lab-own-wifi wlan1mon
# остановить через несколько секунд и вернуть сеть
sudo airmon-ng stop wlan1mon
sudo systemctl restart NetworkManager</code></pre><p>Не добавляйте команды принудительной деавторизации. Для проверки достаточно увидеть beacon и подключение вашего тестового клиента.</p><h2>3. Проверить результат</h2><pre><code class="language-bash">ls -lh lab-own-wifi-*.cap
aircrack-ng lab-own-wifi-01.cap
sha256sum lab-own-wifi-01.cap</code></pre><p>Удалите capture после анализа: в нём могут быть идентификаторы устройств. Для WPA3 и хорошей фразы отсутствие подбора — ожидаемый результат; главное — безопасная конфигурация.</p><p><a href="https://www.aircrack-ng.org/doku.php?id=airmon-ng">Aircrack-ng documentation</a></p>

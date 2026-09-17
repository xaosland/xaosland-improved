---
id: wireshark-pcap-lab
category: Обучение
title: Wireshark и PCAP: лаборатория разбора сетевого трафика
excerpt: Создаём безопасный PCAP на loopback, фильтруем DNS и HTTP, находим ошибки протокола и формулируем выводы для защиты.
date: 2026-09-17
readTime: 14
featured: false
popular: false
tags: [wireshark, pcap, сети, лаборатория]
lab: true
labTools: [Wireshark, tcpdump, curl]
labLevel: Начальный
image: ""
metaTitle: Wireshark и PCAP: лаборатория разбора сетевого трафика
metaDescription: Создаём безопасный PCAP на loopback, фильтруем DNS и HTTP, находим ошибки протокола и формулируем выводы для защиты.
source: xaosland
sourceUrl: https://xaosland.ru/learning/wireshark-pcap-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Сценарий</h2><p>Чтобы не затрагивать чужой трафик, захватываем только loopback и создаём запрос к локальному HTTP‑серверу. На рабочей сети выбирайте интерфейс и фильтр только при наличии разрешения.</p><h2>1. Создать трафик</h2><pre><code class="language-bash">python3 -m http.server 8765 --bind 127.0.0.1 &amp;
CAP=$HOME/wireshark-lab.pcapng
sudo timeout 15 tcpdump -i lo -w "$CAP" 'port 8765' &amp;
sleep 2
curl -s http://127.0.0.1:8765/ >/dev/null
wait || true
ls -lh "$CAP"</code></pre><h2>2. Разобрать PCAP</h2><p>Откройте файл в Wireshark и примените фильтры:</p><pre><code class="language-text">tcp.port == 8765
tcp.flags.syn == 1 && tcp.flags.ack == 0
http.request
frame contains "GET"
</code></pre><p>Найдите TCP handshake, HTTP GET и ответ сервера. В Statistics → Conversations сравните число пакетов и байт. Зафиксируйте, какие данные видны в незашифрованном HTTP.</p><h2>3. Повторить в tshark</h2><pre><code class="language-bash">tshark -r "$CAP" -Y 'http.request' -T fields -e frame.time -e ip.src -e http.request.uri
capinfos "$CAP"
sha256sum "$CAP"</code></pre><h2>4. Выводы для защиты</h2><p>Замените HTTP на HTTPS в продуктивной системе, ограничьте захват правами доступа и удалите PCAP после отчёта. PCAP может содержать токены, имена и содержимое запросов.</p><p><a href="https://www.wireshark.org/docs/wsug_html_chunked/">Wireshark User’s Guide</a> · <a href="https://www.tcpdump.org/manpages/tcpdump.1.html">tcpdump manual</a></p>

---
id: kali-responder
category: Обучение
title: Responder — LLMNR/NBT-NS/mDNS Отравитель
excerpt: Этот пакет содержит Responder/MultiRelay, отравитель LLMNR, NBT-NS и MDNS. Он будет отвечать на определенные запросы NBT-NS (служба имен NetBIOS) на основе суффикса имени (см.: http://support.microsoft.com/kb/163409). По умолчанию инструмен
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Responder — LLMNR/NBT-NS/mDNS Отравитель
metaDescription: Этот пакет содержит Responder/MultiRelay, отравитель LLMNR, NBT-NS и MDNS. Он будет отвечать на определенные запросы NBT-NS (служба имен NetBIOS) на о
source: kali.org
sourceUrl: https://www.kali.org/tools/responder/
---

<h2>Что это</h2>
<p>Этот пакет содержит Responder/MultiRelay, отравитель LLMNR, NBT-NS и MDNS. Он будет отвечать на определенные запросы NBT-NS (служба имен NetBIOS) на основе суффикса имени (см.: http://support.microsoft.com/kb/163409). По умолчанию инструмент отвечает только на запрос службы файлового сервера, предназначенный для SMB.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>This package contains Responder/MultiRelay, an LLMNR, NBT-NS and MDNS poisoner. It will answer to specific NBT-NS (NetBIOS Name Service) queries based on their name suffix (see: http://support.microsoft.com/kb/163409) . By default, the tool will only answer to File Server Service request, which is for SMB.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# responder -h
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

Usage: python3 Responder.py -I eth0 -v

══════════════════════════════════════════════════════════════════════════════
  Responder - LLMNR/NBT-NS/mDNS Poisoner and Rogue Authentication Servers
══════════════════════════════════════════════════════════════════════════════
Captures credentials by responding to broadcast/multicast name resolution,
DHCP, DHCPv6 requests
══════════════════════════════════════════════════════════════════════════════

Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit

  Required Options:
These options must be specified

    -I eth0, --interface=eth0
                        Network interface to use. Use 'ALL' for all
                        interfaces.

  Poisoning Options:
Control how Responder poisons name resolution requests

    -A, --analyze       Analyze mode. See requests without poisoning.
                        (passive)
    -e IP, --externalip=IP
                        Poison with a different IPv4 address than Responder's.
    -6 IPv6, --externalip6=IPv6
                        Poison with a different IPv6 address than Responder's.
    --rdnss             Poison via Router Advertisements with RDNSS. Sets
                        attacker as IPv6 DNS.
    --dnssl=DOMAIN      Poison via Router Advertisements with DNSSL. Injects
                        DNS search suffix.
    -t HEX, --ttl=HEX   Set TTL for poisoned answers. Hex value (30s = 1e) or
                        'random'.
    -N NAME, --Answe</code></pre>
<h2>Пакеты и установка</h2>
<h3>responder</h3>
<p><strong>LLMNR/NBT-NS/mDNS Отравитель</strong><br>Установка: <code>sudo apt install responder</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/responder/" target="_blank" rel="noopener">https://www.kali.org/tools/responder/</a></p>

---
id: kali-hping3
category: Обучение
title: Hping3 — Инструмент активного разрушения сети
excerpt: hping3 — это сетевой инструмент, способный отправлять собственные пакеты ICMP/UDP/TCP и отображать целевые ответы, как это делает ping с ответами ICMP. Он обрабатывает фрагментацию, произвольное тело и размер пакета и может использоваться д
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Hping3 — Инструмент активного разрушения сети
metaDescription: hping3 — это сетевой инструмент, способный отправлять собственные пакеты ICMP/UDP/TCP и отображать целевые ответы, как это делает ping с ответами ICMP
source: kali.org
sourceUrl: https://www.kali.org/tools/hping3/
---

<h2>Что это</h2>
<p>hping3 — это сетевой инструмент, способный отправлять собственные пакеты ICMP/UDP/TCP и отображать целевые ответы, как это делает ping с ответами ICMP. Он обрабатывает фрагментацию, произвольное тело и размер пакета и может использоваться для передачи файлов по поддерживаемым протоколам. Используя hping3, вы можете тестировать правила брандмауэра, выполнять (поддельное) сканирование портов, тестировать производительность сети с использованием различных протоколов, выполнять обнаружение MTU пути, выполнять действия, подобные трассировке маршрута, в соответствии с различными протоколами, снимать отпечатки пальцев удаленных операционных систем, проверять стеки TCP/IP и т. д. hping3 поддерживает сценарии с использованием языка Tcl.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>hping3 is a network tool able to send custom ICMP/UDP/TCP packets and to display target replies like ping does with ICMP replies. It handles fragmentation and arbitrary packet body and size, and can be used to transfer files under supported protocols. Using hping3, you can test firewall rules, perform (spoofed) port scanning, test network performance using different protocols, do path MTU discovery, perform traceroute-like actions under different protocols, fingerprint remote operating systems, audit TCP/IP stacks, etc. hping3 is scriptable using the Tcl language.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# hping3 -h
usage: hping3 host [options]
  -h  --help      show this help
  -v  --version   show version
  -c  --count     packet count
  -i  --interval  wait (uX for X microseconds, for example -i u1000)
      --fast      alias for -i u10000 (10 packets for second)
      --faster    alias for -i u1000 (100 packets for second)
      --flood	   sent packets as fast as possible. Don't show replies.
  -n  --numeric   numeric output
  -q  --quiet     quiet
  -I  --interface interface name (otherwise default routing interface)
  -V  --verbose   verbose mode
  -D  --debug     debugging info
  -z  --bind      bind ctrl+z to ttl           (default to dst port)
  -Z  --unbind    unbind ctrl+z
      --beep      beep for every matching packet received
Mode
  default mode     TCP
  -0  --rawip      RAW IP mode
  -1  --icmp       ICMP mode
  -2  --udp        UDP mode
  -8  --scan       SCAN mode.
                   Example: hping --scan 1-30,70-90 -S www.target.host
  -9  --listen     listen mode
IP
  -a  --spoof      spoof source address
  --rand-dest      random destionation address mode. see the man.
  --rand-source    random source address mode. see the man.
  -t  --ttl        ttl (default 64)
  -N  --id         id (default random)
  -W  --winid      use win* id byte ordering
  -r  --rel        relativize id field          (to estimate host traffic)
  -f  --frag       split packets in more frag.  (may pass weak acl)
  -x  --morefrag   set more fragments flag
  -y  --dontfrag   set don't fragment flag
  -g  --fragoff    set the fragment offset
  -m  --mtu        set virtual mtu, implies --frag if packet size > mtu
  -o  --tos        type of service (default 0x00), try --tos help
  -G  --rroute     includes RECORD_ROUTE option and display the route buffer
  --lsrr      </code></pre>
<h2>Пакеты и установка</h2>
<h3>hping3</h3>
<p><strong>Инструмент активного разрушения сети</strong><br>Установка: <code>sudo apt install hping3</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/hping3/" target="_blank" rel="noopener">https://www.kali.org/tools/hping3/</a></p>

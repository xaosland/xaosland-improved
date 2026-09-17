---
id: smb-local-audit-lab
category: Обучение
title: SMB: лаборатория аудита общей папки на своём Windows/Linux стенде
excerpt: Создаём тестовую SMB‑шару, проверяем доступы с smbclient и Nmap, затем закрываем анонимный доступ и повторяем проверку.
date: 2026-09-17
readTime: 13
featured: false
popular: false
tags: [smb, windows, samba, лаборатория]
lab: true
labTools: [Samba, smbclient, Nmap]
labLevel: Средний
image: ""
metaTitle: SMB: лаборатория аудита общей папки на своём Windows/Linux стенде
metaDescription: Создаём тестовую SMB‑шару, проверяем доступы с smbclient и Nmap, затем закрываем анонимный доступ и повторяем проверку.
source: xaosland
sourceUrl: https://xaosland.ru/learning/smb-local-audit-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Схема стенда</h2><p>Используем Samba на localhost или отдельной VM. Цель — увидеть разницу между гостевым и аутентифицированным доступом, а затем закрыть гостевой вход. Не проверяйте реальные Windows‑сети без согласования.</p><h2>1. Поднять тестовую шару</h2><pre><code class="language-bash">sudo apt install -y samba smbclient nmap
sudo mkdir -p /srv/samba/lab-share
printf 'только учебный файл\n' | sudo tee /srv/samba/lab-share/readme.txt
sudo chmod -R 0755 /srv/samba/lab-share
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.lab-backup
sudo tee -a /etc/samba/smb.conf &lt;&lt;'EOF'
[lab-share]
   path = /srv/samba/lab-share
   read only = yes
   guest ok = no
   browsable = yes
EOF
sudo testparm -s
sudo systemctl restart smbd</code></pre><h2>2. Проверить только локальный сервис</h2><pre><code class="language-bash">smbclient -L //127.0.0.1 -N
smbclient //127.0.0.1/lab-share -U "$USER" -c 'ls' || true
nmap -Pn -p445 --script smb-protocols,smb2-security-mode 127.0.0.1</code></pre><p>Ожидайте отказ гостю. Если служба открыта в host-only сети, укажите её IP в отчёте и убедитесь, что firewall разрешает только нужный сегмент.</p><h2>3. Контроль доступа и уборка</h2><p>Проверьте права каталога и отсутствие записи для гостя. После занятия удалите секцию <code>[lab-share]</code>, восстановите конфигурацию из backup при необходимости и остановите службу.</p><pre><code class="language-bash">sudo testparm -s
sudo grep -A8 '^\[lab-share\]' /etc/samba/smb.conf
sudo sed -i '/^\[lab-share\]/,$d' /etc/samba/smb.conf
sudo systemctl restart smbd</code></pre><p>Команда <code>sed</code> в последнем блоке подходит только для стенда, где секция добавлена последней; в реальной конфигурации редактируйте файл вручную и сохраняйте остальные шары.</p><p><a href="https://www.samba.org/samba/docs/">Samba documentation</a> · <a href="https://www.samba.org/samba/docs/current/man-html/smbclient.1.html">smbclient manual</a></p>

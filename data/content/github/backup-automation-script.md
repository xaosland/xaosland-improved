<h2>Автоматизация бэкапов с помощью скрипта</h2>
<p>Предлагаю готовый bash-скрипт для автоматического резервного копирования папок с архивацией.</p>

<pre><code>#!/bin/bash
# Бэкап папки /home/user/documents в /backup с датой

SOURCE="/home/user/documents"
DEST="/backup"
DATE=$(date +%Y-%m-%d_%H-%M)
BACKUP_FILE="backup-$DATE.tar.gz"

tar -czf "$DEST/$BACKUP_FILE" "$SOURCE"
echo "Бэкап создан: $DEST/$BACKUP_FILE"</code></pre>

<h3>Настройка cron для автоматического запуска</h3>
<pre><code># Ежедневно в 2 часа ночи
0 2 * * * /path/to/backup.sh</code></pre>

<p>Скрипт можно дополнить отправкой по FTP или в облако с помощью rclone.</p>
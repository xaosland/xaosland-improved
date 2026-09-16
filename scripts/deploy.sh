#!/usr/bin/env bash
# deploy.sh — git-based атомарный деплой на VPS
# Репозиторий: /var/www/xaosland-git -> сборка -> подмена /var/www/xaosland/dist
# Сериализуется через flock — параллельные деплои (cron + ручной) не гоняются.
set -euo pipefail
exec 9>/tmp/xaosland-deploy.lock
flock 9

REPO=/var/www/xaosland-git
TARGET=/var/www/xaosland/dist
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$REPO"
git pull --rebase origin main
[ -d node_modules ] || npm install --no-audit --no-fund
npm run build

# Проверка целостности сборки — не выкатываем битый dist
for f in dist/css/style.css dist/css/fonts-local.css dist/js/app.js dist/index.html dist/rss.xml dist/sitemap.xml dist/404.html; do
  [ -f "$f" ] || { echo "❌ Сборка неполная: нет $f — деплой отменён"; exit 1; }
done

# OG-картинки опциональны: без sharp сборка валидна, просто без картинок
[ -d dist/og ] && echo "OG-картинок: $(ls dist/og | wc -l)"

# Бэкап текущего dist (держим 3 последних)
mkdir -p /var/www/backups
if [ -d "$TARGET" ]; then
  tar czf "/var/www/backups/dist-$STAMP.tar.gz" -C "$TARGET" . 2>/dev/null || true
  ls -1t /var/www/backups/dist-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f
fi

# Атомарная подмена
rm -rf /var/www/dist.new.$$
mv "$REPO/dist" /var/www/dist.new.$$
mv "$TARGET" "$TARGET.old.$$" 2>/dev/null || true
mv /var/www/dist.new.$$ "$TARGET"
rm -rf "$TARGET.old.$$"
echo "✅ Deployed $STAMP (commit $(git rev-parse --short HEAD))"
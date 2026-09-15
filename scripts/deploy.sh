#!/usr/bin/env bash
# deploy.sh — атомарный деплой dist на VPS
# Строит сайт в staging-копии (hardlink), бэкапит текущий dist и подменяет его.
# Сериализуется через flock — параллельные деплои (cron + ручной) не гоняются.
set -euo pipefail
exec 9>/tmp/xaosland-deploy.lock
flock 9

SRC=/var/www/xaosland
STAGE=/var/www/xaosland-stage
DIST="$SRC/dist"
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$SRC"
[ -d node_modules ] || npm install --no-audit --no-fund

# Staging: жёсткие ссылки — дёшево; build пересоздаст dist внутри staging
rm -rf "$STAGE"
cp -al "$SRC" "$STAGE" 2>/dev/null || cp -a "$SRC" "$STAGE"
cd "$STAGE"
npm run build

# Проверка целостности сборки — не выкатываем битый dist
for f in dist/css/style.css dist/js/app.js dist/index.html dist/rss.xml dist/sitemap.xml; do
  [ -f "$f" ] || { echo "❌ Сборка неполная: нет $f — деплой отменён"; exit 1; }
done

# Бэкап текущего dist (держим 3 последних)
mkdir -p /var/www/backups
if [ -d "$DIST" ]; then
  tar czf "/var/www/backups/dist-$STAMP.tar.gz" -C "$DIST" . 2>/dev/null || true
  ls -1t /var/www/backups/dist-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f
fi

# Атомарная подмена
rm -rf /var/www/dist.new.$$
mv "$STAGE/dist" /var/www/dist.new.$$
mv "$DIST" "$DIST.old.$$" 2>/dev/null || true
mv /var/www/dist.new.$$ "$DIST"
rm -rf "$DIST.old.$$" "$STAGE"
echo "✅ Deployed $STAMP"
---
id: yara-files-lab
category: Обучение
title: YARA: лаборатория поиска признаков в безопасных файлах
excerpt: Пишем правила YARA для учебных маркеров, проверяем каталог образцов и добавляем исключения, чтобы не ловить обычные документы.
date: 2026-09-17
readTime: 11
featured: false
popular: false
tags: [yara, анализ файлов, blue team, лаборатория]
lab: true
labTools: [YARA, sha256sum, strings]
labLevel: Начальный
image: ""
metaTitle: YARA: лаборатория поиска признаков в безопасных файлах
metaDescription: Пишем правила YARA для учебных маркеров, проверяем каталог образцов и добавляем исключения, чтобы не ловить обычные документы.
source: xaosland
sourceUrl: https://xaosland.ru/learning/yara-files-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Подготовить безопасные образцы</h2><p>Создадим два обычных текстовых файла с учебными маркерами. Не скачивайте вредоносные образцы на рабочую машину: для реального анализа используйте изолированный стенд и правила организации.</p><pre><code class="language-bash">sudo apt install -y yara
mkdir -p yara-lab/samples
echo 'training marker: xaosland-lab' &gt; yara-lab/samples/notice.txt
echo 'ordinary notes only' &gt; yara-lab/samples/notes.txt
cat &gt; yara-lab/training.yar &lt;&lt;'EOF'
rule XaosLand_Training_Marker {
  meta:
    purpose = "учебная проверка строки"
    author = "lab"
  strings:
    $marker = "xaosland-lab" ascii nocase
  condition:
    $marker
}
EOF

yara -w yara-lab/training.yar yara-lab/samples</code></pre><h2>Проверить правило</h2><pre><code class="language-bash">yara -s yara-lab/training.yar yara-lab/samples/notice.txt
yara -s yara-lab/training.yar yara-lab/samples/notes.txt
sha256sum yara-lab/samples/*</code></pre><p>Первый запуск должен сработать только на notice.txt. Затем добавьте вторую строку и используйте условие <code>2 of ($marker*)</code>, чтобы потренироваться снижать ложные срабатывания. Для бинарных файлов применяйте отдельный quarantine-каталог без права исполнения.</p><h2>Операционный процесс</h2><p>Правило должно иметь назначение, тестовые положительные и отрицательные образцы, версию и владельца. Не удаляйте файл автоматически по одному совпадению: сначала сохраняйте хэш, подтверждайте находку и следуйте процедуре реагирования.</p><p><a href="https://yara.readthedocs.io/">YARA documentation</a> · <a href="https://github.com/Yara-Rules/rules">YaraRules community repository</a></p>

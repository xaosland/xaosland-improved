<h2>Скрипт для автоматической установки программ после переустановки Windows</h2>
<p>PowerShell скрипт, использующий Winget (встроенный менеджер пакетов Windows 11).</p>

<pre><code># Установка популярного софта
winget install Google.Chrome
winget install Microsoft.Office
winget install 7zip.7zip
winget install Notepad++.Notepad++</code></pre>

<p>Для Windows 10 можно использовать Chocolatey. Создайте файл .bat и запустите его от имени администратора.</p>
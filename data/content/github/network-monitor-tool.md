<h2>Утилита для мониторинга сети</h2>
<p>Небольшая программа на Python для проверки доступности хостов и скорости интернета.</p>

<pre><code>import subprocess
import time

hosts = ["google.com", "ya.ru"]

while True:
    for host in hosts:
        response = subprocess.call(["ping", "-c", "1", host], stdout=subprocess.DEVNULL)
        if response == 0:
            print(f"{host} доступен")
        else:
            print(f"{host} НЕДОСТУПЕН")
    time.sleep(60)</code></pre>

<p>Добавьте логирование в файл и отправку уведомлений через Telegram-бота.</p>
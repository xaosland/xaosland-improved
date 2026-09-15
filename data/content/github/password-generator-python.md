<h2>Генератор паролей на Python</h2>
<p>Простой скрипт для создания надёжных паролей.</p>

<pre><code>import random
import string

def generate_password(length=16):
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(chars) for _ in range(length))

print(generate_password(20))</code></pre>

<p>Можно сохранять пароли в зашифрованный файл с использованием cryptography.</p>
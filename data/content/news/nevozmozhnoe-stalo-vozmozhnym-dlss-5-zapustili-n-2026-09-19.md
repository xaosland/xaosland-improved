---
id: nevozmozhnoe-stalo-vozmozhnym-dlss-5-zapustili-n-2026-09-19
category: Новости
title: Невозможное стало возможным: DLSS 5 запустили на встроенной графике Intel
excerpt: Энтузиасту удалось запустить DLSS 5 Neural Rendering на встроенной графике Intel Arc 140V. Эксперимент примечателен тем, что нейросетевой рендеринг работает без CUDA и фирменных библиотек Nvidia.
date: 2026-09-19
readTime: 1
tags: [новости, технологии]
featured: false
popular: false
image: /images/news/nevozmozhnoe-stalo-vozmozhnym-dlss-5-zapustili-n-2026-09-19.webp
metaTitle: Невозможное стало возможным: DLSS 5 запустили на встроенной 
metaDescription: Энтузиасту удалось запустить DLSS 5 Neural Rendering на встроенной графике Intel Arc 140V. Эксперимент примечателен тем, что нейросетевой рендеринг ра
source: IXBT
sourceUrl: https://www.ixbt.com/news/2026/09/19/436890-nevozmoznoe-stalo-vozmoznym-dlss-5-zapustili-na-vstroennoi-grafike-intel.html
---

Энтузиасту удалось запустить DLSS 5 Neural Rendering на встроенной графике Intel Arc 140V. Эксперимент примечателен тем, что нейросетевой рендеринг работает без CUDA и фирменных библиотек Nvidia.
Разработчик под ником u/Uzbekunknown создал проект dlss-nr-on-intel, рассчитанный на интегрированную графику Arc 140V архитектуры Xe2 в процессорах Intel Lunar Lake. В качестве тестовой платформы использовался Core Ultra 7 256V.
Для запуска DLSS 5 автор сборки реализовал обработку через Vulkan в Linux. Мод удалось запустить в нескольких играх, включая Dead or Alive 5 Last Round, Tekken 7 и Mortal Kombat 1. Однако вычислительная нагрузка оказалась колоссальной. При разрешении 1280×720 Arc 140V выдавала всего 3–5 кадров в секунду, а в Tekken 7 после снижения разрешения до 640×360 производительность выросла лишь до 10,5 FPS. По словам разработчика, обработка одного кадра в Full HD может занимать сотни миллисекунд.
Высокими оказались и требования к памяти. Только буферы, необходимые для работы нейросети при разрешении 720p, занимают около 2,3 ГБ. Поскольку Arc 140V является интегрированным графическим процессором, вся эта память выделяется из общей оперативной памяти ноутбука.

---

**Источник:** IXBT — <https://www.ixbt.com/news/2026/09/19/436890-nevozmoznoe-stalo-vozmoznym-dlss-5-zapustili-na-vstroennoi-grafike-intel.html>
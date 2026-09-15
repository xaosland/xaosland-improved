(function () {
    'use strict';

    // ---------- Конфигурация ----------
    const CONFIG = {
        categoryTranslit: {
            'news': 'Новости',
            'articles': 'Статьи',
            'pentest': 'Пентестинг',
            'windows': 'Windows',
            'programs': 'Программы',
            'games': 'Игры',
            'scripts': 'Скрипты',
            'learning': 'Обучение',
            'networks': 'Сети',
            'github': 'GitHub проекты',
            'ozon': 'Ozon находки'
        },
        categoryIcons: {
            'Новости': 'fas fa-bolt',
            'Статьи': 'fas fa-newspaper',
            'Пентестинг': 'fas fa-user-secret',
            'Windows': 'fab fa-windows',
            'Программы': 'fas fa-code',
            'Игры': 'fas fa-gamepad',
            'Скрипты': 'fas fa-terminal',
            'Сети': 'fas fa-network-wired',
            'Обучение': 'fas fa-graduation-cap',
            'GitHub проекты': 'fab fa-github',
            'Ozon находки': 'fas fa-shopping-bag'
        },
        ITEMS_PER_PAGE: 6,
        DEFAULT_META_DESCRIPTION: 'IT-блог о программах, Windows, играх и кибербезопасности. Гайды, скрипты, оптимизация и полезные инструменты.',
        CACHE_EXPIRY: 5 * 60 * 1000,
        CACHE_VERSION: 'v4'
    };

    // ---------- Вспомогательные функции ----------
    function getIconForCategory(category) {
        return CONFIG.categoryIcons[category] || 'fas fa-folder';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function getCategoryFromSlug(slug) {
        return CONFIG.categoryTranslit[slug] || null;
    }

    function getSlugFromCategory(category) {
        for (let [slug, cat] of Object.entries(CONFIG.categoryTranslit)) {
            if (cat === category) return slug;
        }
        return null;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return escapeHtml(text).replace(/"/g, '&quot;');
    }

    function stripFrontmatter(markdown) {
        const trimmed = markdown.replace(/^\uFEFF/, '').trimStart();
        if (!trimmed.startsWith('---')) return markdown;
        const lines = trimmed.split('\n');
        let endIndex = -1;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                endIndex = i;
                break;
            }
        }
        if (endIndex === -1) return markdown;
        return lines.slice(endIndex + 1).join('\n').trim();
    }



    // ---------- Уведомления ----------
    function showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        const iconMap = {
            info: 'fa-info-circle',
            error: 'fa-exclamation-circle',
            success: 'fa-check-circle'
        };
        const icon = iconMap[type] || iconMap.info;
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `<i class="fas ${icon}"></i> ${escapeHtml(message)}`;
        container.appendChild(notif);
        setTimeout(() => {
            notif.classList.add('fade-out');
            setTimeout(() => notif.remove(), 300);
        }, duration);
    }

    // ---------- Основной класс ----------
    class App {
        constructor() {
            this.articles = [];
            this.container = document.querySelector('.main-articles');
            this.popularList = document.querySelector('.sidebar-links:first-of-type');
            this.categoryList = document.querySelector('.category-links');
            this.breadcrumb = document.querySelector('.breadcrumb');
            this.filterTags = document.querySelector('.filter-tags');
            this.paginationContainer = document.getElementById('pagination-container');

            this.currentCategory = null;
            this.currentArticleId = null;
            this.requestedArticleId = null;
            this.currentPage = 1;
            this.currentTag = null;
            this.searchQuery = null;
            this.searchDebounceTimer = null;
            this.staticPage = null;

            this.burgerBtn = document.querySelector('.burger-btn');
            this.navMenu = document.querySelector('.nav-menu');
            this.overlay = document.getElementById('overlay');
            this.body = document.body;

            this.searchInput = document.getElementById('search-input');
            this.searchSuggestions = document.getElementById('search-suggestions');
            this.scrollTopBtn = document.getElementById('scroll-top');
            this.readingProgress = document.getElementById('reading-progress');
            this.tagCloud = document.getElementById('tag-cloud');
            this.favoritesList = document.getElementById('favorites-list');

            this.staticPages = {
                'about': '/about.html',
                'contacts': '/contacts.html',
                'privacy': '/privacy.html'
            };

            this.initScrollTop();
            this.initReadingProgress();
            this.initFavorites();
            this.initSearchSuggestions();

            this.filterTags.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-btn');
                if (btn) {
                    const tag = btn.dataset.tag;
                    this.filterByTag(tag);
                }
            });
        }

        initTocHighlight() {
            const toc = document.querySelector('.article-toc');
            if (!toc) return;

            const links = toc.querySelectorAll('a[href^="#"]');
            if (links.length === 0) return;

            const headings = Array.from(links).map(a => {
                const id = a.getAttribute('href').slice(1);
                return document.getElementById(id);
            }).filter(Boolean);

            if (headings.length === 0) return;

            const onScroll = () => {
                const scrollPos = window.scrollY + 120; // отступ под sticky-шапку
                let current = headings[0];

                for (const h of headings) {
                    if (h.offsetTop <= scrollPos) current = h;
                    else break;
                }

                toc.querySelectorAll('li').forEach(li => li.classList.remove('toc-active'));
                toc.querySelectorAll('a').forEach(a => a.classList.remove('toc-active'));

                const activeLink = toc.querySelector(`a[href="#${current.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('toc-active');
                    activeLink.parentElement.classList.add('toc-active');
                }
            };

            window.removeEventListener('scroll', this._tocScrollHandler || (() => {}));
            this._tocScrollHandler = onScroll;
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }



        // ---------- Кнопка наверх ----------
        initScrollTop() {
            const updateProgress = () => {
                if (!this.scrollTopBtn) return;
                const h = document.documentElement;
                const max = h.scrollHeight - h.clientHeight;
                const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
                this.scrollTopBtn.style.setProperty('--progress', p + '%');

                if (window.scrollY > 500) this.scrollTopBtn.classList.add('show');
                else this.scrollTopBtn.classList.remove('show');
            };

            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();

            if (this.scrollTopBtn) {
                this.scrollTopBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }

        // ---------- Прогресс чтения ----------
        initReadingProgress() {
            if (!this.readingProgress) return;
            window.addEventListener('scroll', () => {
                const article = document.querySelector('.full-article');
                if (!article) {
                    this.readingProgress.style.width = '0';
                    return;
                }
                const rect = article.getBoundingClientRect();
                const totalHeight = article.offsetHeight - window.innerHeight;
                const progress = Math.min(1, Math.max(0, -rect.top / totalHeight));
                this.readingProgress.style.width = `${progress * 100}%`;

                // Сдвиг цвета от зелёного к розовому
                const hue = 100 - progress * 200; // 100 (зелёный) → -100 (фиолетовый)
                this.readingProgress.style.background = `hsl(${hue}, 100%, 50%)`;
            }, { passive: true });
        }

        // ---------- Избранное ----------
        initFavorites() {
            this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            this.renderFavorites();
            document.addEventListener('click', (e) => {
                const favBtn = e.target.closest('.favorite-btn');
                if (favBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const articleId = decodeURIComponent(favBtn.dataset.id);
                    this.toggleFavorite(articleId);
                }
            });
        }

        toggleFavorite(articleId) {
            if (!articleId) return;
            const idx = this.favorites.indexOf(articleId);
            if (idx === -1) {
                this.favorites.push(articleId);
                showNotification('Статья добавлена в избранное', 'success');
            } else {
                this.favorites.splice(idx, 1);
                showNotification('Статья удалена из избранного', 'info');
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.renderFavorites();
            this.updateFavoriteButtons();
        }

        renderFavorites() {
            if (!this.favoritesList) return;
            if (this.favorites.length === 0) {
                this.favoritesList.innerHTML = '<li>Нет избранных статей</li>';
                return;
            }
            this.favoritesList.innerHTML = this.favorites.map(id => {
                const article = this.articles.find(a => a.id === id);
                if (!article) return '';
                const slug = getSlugFromCategory(article.category);
                return `
                    <li>
                        <a href="/${slug}/${encodeURIComponent(article.id)}/">${escapeHtml(article.title)}</a>
                        <button class="fav-remove" data-id="${encodeURIComponent(article.id)}" aria-label="Удалить из избранного"><i class="fas fa-times"></i></button>
                    </li>
                `;
            }).join('');
            this.favoritesList.querySelectorAll('.fav-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = decodeURIComponent(btn.dataset.id);
                    this.toggleFavorite(id);
                });
            });
        }

        updateFavoriteButtons() {
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                const id = btn.dataset.id;
                btn.classList.toggle('active', this.favorites.includes(id));
            });
        }

        // ---------- Поиск с подсказками ----------
        initSearchSuggestions() {
            if (!this.searchInput || !this.searchSuggestions) return;
            this.searchInput.addEventListener('input', () => {
                const query = this.searchInput.value.trim().toLowerCase();
                if (query.length < 2) {
                    this.searchSuggestions.innerHTML = '';
                    this.searchSuggestions.classList.remove('show');
                    return;
                }
                const matches = this.articles.filter(a => {
                    const title = a.title.toLowerCase();
                    const excerpt = a.excerpt.toLowerCase();
                    const category = a.category.toLowerCase();
                    const tags = a.tags.map(t => t.toLowerCase()).join(' ');
                    return title.includes(query) || excerpt.includes(query) || category.includes(query) || tags.includes(query);
                }).slice(0, 5);
                if (matches.length === 0) {
                    this.searchSuggestions.innerHTML = '<div class="suggestion-item">Ничего не найдено</div>';
                    this.searchSuggestions.classList.add('show');
                    return;
                }
                this.searchSuggestions.innerHTML = matches.map(a => {
                    const slug = getSlugFromCategory(a.category);
                    return `
                        <a href="/${slug}/${encodeURIComponent(a.id)}/" class="suggestion-item">
                            <div class="suggestion-title">${escapeHtml(a.title)}</div>
                            <div class="suggestion-meta">${escapeHtml(a.category)} · ${formatDate(a.date)}</div>
                        </a>
                    `;
                }).join('');
                this.searchSuggestions.classList.add('show');
            });
            document.addEventListener('click', (e) => {
                if (!this.searchSuggestions.contains(e.target) && e.target !== this.searchInput) {
                    this.searchSuggestions.classList.remove('show');
                }
            });
            this.searchSuggestions.addEventListener('click', (e) => {
                const suggestion = e.target.closest('.suggestion-item');
                if (suggestion) {
                    this.searchSuggestions.classList.remove('show');
                }
            });
        }

        // ---------- Загрузка с кэшированием ----------
        async fetchWithCache(url, cacheKey) {
            const key = `${CONFIG.CACHE_VERSION}_${cacheKey}`;
            const cached = localStorage.getItem(key);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    const timestamp = data._timestamp || 0;
                    if (Date.now() - timestamp < CONFIG.CACHE_EXPIRY) {
                        return data.value;
                    }
                } catch (e) { /* ignore */ }
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Ошибка загрузки ${url}`);
                const data = await response.json();
                localStorage.setItem(key, JSON.stringify({
                    _timestamp: Date.now(),
                    value: data
                }));
                return data;
            } catch (error) {
                showNotification(`Не удалось загрузить данные (${url})`, 'error');
                return null;
            }
        }

        // ---------- Инициализация ----------
        async init() {
            try {
                const articlesData = await this.fetchWithCache('/data/base.json', 'cache_articles');
                if (!articlesData) throw new Error('Не удалось загрузить статьи');
                this.articles = articlesData.articles.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                const navData = await this.fetchWithCache('/data/navigation.json', 'cache_navigation');
                const footerData = await this.fetchWithCache('/data/footer.json', 'cache_footer');

                await this.renderNavigation(navData);
                await this.renderFooter(footerData);

                this.handleRoute();
                this.setupNavigation();
                this.initBurgerMenu();
                this.initSearch();
                await this.render();
                this.updateCopyrightYear();
                this.renderTagCloud();
                this.renderFavorites();

            } catch (error) {
                showNotification('Критическая ошибка загрузки данных. Попробуйте перезагрузить страницу.', 'error');
                this.container.innerHTML = '<p style="color: red;">Не удалось загрузить данные. Попробуйте позже.</p>';
            }
        }

        // ---------- Поиск (ТОЛЬКО ПО ENTER ИЛИ КНОПКЕ) ----------
        initSearch() {
            const input = document.getElementById('search-input');
            const btn = document.getElementById('search-btn');
            if (!input) return;

            const performSearch = () => {
                const query = input.value.trim();
                if (query.length < 2) {
                    this.searchQuery = null;
                    const url = new URL(window.location);
                    url.searchParams.delete('search');
                    window.history.pushState(null, '', url);
                    this.currentPage = 1;
                    this.render();
                    return;
                }
                this.searchQuery = query;
                this.currentPage = 1;
                const url = new URL(window.location);
                url.searchParams.set('search', query);
                window.history.pushState(null, '', url);
                this.render();
            };

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(this.searchDebounceTimer);
                    performSearch();
                }
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                clearTimeout(this.searchDebounceTimer);
                performSearch();
            });
        }


        getViewCount(articleId) {
            let views = localStorage.getItem('views');
            if (!views) return 0;
            try {
                views = JSON.parse(views);
                return views[articleId] || 0;
            } catch (e) {
                return 0;
            }
        }

        // ---------- Роутинг ----------
        handleRoute() {
            const path = window.location.pathname;
            const search = window.location.search;
            const params = new URLSearchParams(search);
            const page = parseInt(params.get('page')) || 1;
            this.currentPage = Math.max(1, page);
            this.currentTag = params.get('tag') || null;
            this.searchQuery = params.get('search') || null;
            this.staticPage = null;

            const parts = path.replace(/^\/|\/$/g, '').split('/');
            if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
                this.currentCategory = null;
                this.currentArticleId = null;
                this.requestedArticleId = null;
                return;
            }
            if (this.staticPages[parts[0]]) {
                this.staticPage = parts[0];
                this.currentCategory = null;
                this.currentArticleId = null;
                this.requestedArticleId = null;
                return;
            }

            const slug = parts[0];
            const category = getCategoryFromSlug(slug);
            if (!category) {
                this.currentCategory = null;
                this.currentArticleId = null;
                this.requestedArticleId = null;
                return;
            }

            this.currentCategory = category;
            if (parts.length > 1) {
                const id = parts[1];
                this.requestedArticleId = id;
                const article = this.articles.find(a => a.category === category && a.id === id);
                this.currentArticleId = article ? id : null;
            } else {
                this.requestedArticleId = null;
                this.currentArticleId = null;
            }
        }

        // ---------- SPA-навигация ----------
        setupNavigation() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                if (this.burgerBtn && this.burgerBtn.contains(link)) return;

                // Не перехватываем клики с модификаторами и открытие в новой вкладке
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
                if (link.target === '_blank' || link.hasAttribute('download')) return;

                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                if (href.match(/\.(css|js|json|png|jpg|svg|woff2?|html)$/i)) return;

                e.preventDefault();
                window.history.pushState(null, '', href);
                this.handleRoute();
                this.render();
                if (this.closeMenu && typeof this.closeMenu === 'function') this.closeMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('popstate', () => {
                this.handleRoute();
                this.render();
                if (this.closeMenu && typeof this.closeMenu === 'function') this.closeMenu();
            });
        }

        // ---------- Бургер-меню ----------
        initBurgerMenu() {
            if (!this.burgerBtn || !this.navMenu) return;

            const openMenu = () => {
                this.burgerBtn.classList.add('active');
                this.navMenu.classList.add('active');
                this.body.classList.add('menu-open');
                document.documentElement.classList.add('menu-open');
                if (this.overlay) this.overlay.classList.add('overlay-active');
                this.burgerBtn.setAttribute('aria-expanded', 'true');
            };

            const closeMenu = () => {
                this.burgerBtn.classList.remove('active');
                this.navMenu.classList.remove('active');
                this.body.classList.remove('menu-open');
                document.documentElement.classList.remove('menu-open');
                if (this.overlay) this.overlay.classList.remove('overlay-active');
                this.burgerBtn.setAttribute('aria-expanded', 'false');
            };

            this.closeMenu = closeMenu;
            this.openMenu = openMenu;

            this.burgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.burgerBtn.classList.contains('active')) closeMenu();
                else openMenu();
            });

            if (this.overlay) {
                this.overlay.addEventListener('click', closeMenu);
            }

            this.navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) setTimeout(closeMenu, 100);
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) closeMenu();
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) closeMenu();
            });

            document.addEventListener('click', (event) => {
                if (window.innerWidth <= 768 && this.navMenu.classList.contains('active')) {
                    const isClickInsideMenu = this.navMenu.contains(event.target);
                    const isClickOnBurger = this.burgerBtn.contains(event.target);
                    if (!isClickInsideMenu && !isClickOnBurger) closeMenu();
                }
            });
        }

        // ---------- Основной рендер ----------
        async render() {
            try {
                if (this.searchSuggestions) this.searchSuggestions.classList.remove('show');

                if (!document.querySelector('.full-article') && this.readingProgress) {
                    this.readingProgress.style.width = '0';
                }

                if (this.searchQuery && this.searchQuery.length > 0) {
                    this.renderSearch();
                    this.renderBreadcrumb();
                    this.updateActiveNavLink();
                    this.updateMetaTags(`Результаты поиска по запросу "${this.searchQuery}"`);
                    return;
                }

                if (this.staticPage) {
                    await this.renderStaticPage(this.staticPage);
                    this.renderBreadcrumb();
                    this.updateActiveNavLink();
                    this.updateMetaTags('Статическая страница');
                    return;
                }

                if (this.requestedArticleId && !this.currentArticleId) {
                    showNotification('Статья не найдена', 'error');
                    this.container.innerHTML = '<p>Статья не найдена.</p>';
                    if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                    this.renderBreadcrumb();
                    this.updateActiveNavLink();
                    this.updateMetaTags(CONFIG.DEFAULT_META_DESCRIPTION);
                    return;
                }

                this.renderPopular();
                this.renderCategories();

                if (this.currentArticleId) {
                    const article = this.articles.find(a => a.id === this.currentArticleId && a.category === this.currentCategory);
                    if (article) {
                        await this.renderArticle(article);
                        if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                    } else {
                        showNotification('Статья не найдена', 'error');
                        this.container.innerHTML = '<p>Статья не найдена.</p>';
                    }
                } else if (this.currentCategory) {
                    if (this.requestedArticleId) {
                        showNotification('Статья не найдена', 'error');
                        this.container.innerHTML = '<p>Статья не найдена.</p>';
                        this.renderBreadcrumb();
                        this.updateActiveNavLink();
                        this.updateMetaTags(CONFIG.DEFAULT_META_DESCRIPTION);
                        return;
                    }
                    this.renderCategory(this.currentCategory, this.currentPage);
                } else {
                    this.renderHome(this.currentPage);
                }

                this.renderBreadcrumb();
                this.updateActiveNavLink();
            } catch (error) {
                showNotification('Ошибка при загрузке контента', 'error');
            }
        }

        // ---------- Рендер статической страницы ----------
        async renderStaticPage(slug) {
            const fileUrl = this.staticPages[slug];
            if (!fileUrl) {
                this.container.innerHTML = '<p>Страница не найдена.</p>';
                return;
            }
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('Ошибка загрузки страницы');
                const html = await response.text();

                const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                if (titleMatch) document.title = titleMatch[1];

                const bodyContent = html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>([\s\S]*?)<\/body>[\s\S]*?<\/html>/i, '$1');
                this.container.innerHTML = bodyContent || html;

                if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                if (this.filterTags) this.filterTags.innerHTML = '';
                if (this.readingProgress) this.readingProgress.style.width = '0';
            } catch (error) {
                this.container.innerHTML = '<p>Не удалось загрузить страницу.</p>';
                showNotification('Ошибка загрузки статической страницы', 'error');
            }
        }

        // ---------- Рендер главной ----------
        renderHome(page) {
            document.title = 'XaosLand | IT-блог о технологиях';
            this.updateMetaTags(CONFIG.DEFAULT_META_DESCRIPTION);
            if (this.filterTags) this.filterTags.innerHTML = '';

            let articles = this.articles;
            if (this.currentTag) {
                articles = articles.filter(a => a.tags.includes(this.currentTag));
            } else {
                articles = articles.filter(a => a.featured === true);
            }

            if (articles.length === 0) {
                this.container.innerHTML = '<p>Нет статей для отображения.</p>';
                if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                return;
            }

            const total = articles.length;
            const perPage = CONFIG.ITEMS_PER_PAGE;
            const totalPages = Math.ceil(total / perPage);
            const currentPage = Math.min(page, totalPages);
            const start = (currentPage - 1) * perPage;
            const end = Math.min(start + perPage, total);
            const pageItems = articles.slice(start, end);

            this.container.innerHTML = pageItems.map(a => this.createCardHTML(a)).join('');
            const baseUrl = this.buildBaseUrl();
            this.renderPagination(totalPages, currentPage, baseUrl);
            this.updateFavoriteButtons();
        }

        // ---------- Рендер категории ----------
        renderCategory(category, page) {
            document.title = category + ' - XaosLand | IT-блог';
            this.updateMetaTags(`Статьи в категории "${category}"`);

            let articles = this.articles.filter(a => a.category === category);
            if (this.currentTag) {
                articles = articles.filter(a => a.tags.includes(this.currentTag));
            }

            if (articles.length === 0) {
                this.container.innerHTML = `<p>В категории "${escapeHtml(category)}" нет статей.</p>`;
                if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                return;
            }

            this.renderFilterTags(articles);

            const total = articles.length;
            const perPage = CONFIG.ITEMS_PER_PAGE;
            const totalPages = Math.ceil(total / perPage);
            const currentPage = Math.min(page, totalPages);
            const start = (currentPage - 1) * perPage;
            const end = Math.min(start + perPage, total);
            const pageItems = articles.slice(start, end);

            this.container.innerHTML = pageItems.map(a => this.createCardHTML(a)).join('');
            const baseUrl = this.buildBaseUrl();
            this.renderPagination(totalPages, currentPage, baseUrl);
            this.updateFavoriteButtons();
        }

        // ---------- Рендер поиска ----------
        renderSearch() {
            if (this.filterTags) this.filterTags.innerHTML = '';
            const query = this.searchQuery;
            document.title = `Поиск: "${query}" - XaosLand`;
            this.updateMetaTags(`Результаты поиска по запросу "${query}"`);

            const q = query.toLowerCase();
            const results = this.articles.filter(a => {
                const title = a.title.toLowerCase();
                const excerpt = a.excerpt.toLowerCase();
                const category = a.category.toLowerCase();
                const tags = a.tags.map(t => t.toLowerCase()).join(' ');
                return title.includes(q) || excerpt.includes(q) || category.includes(q) || tags.includes(q);
            });

            if (results.length === 0) {
                this.container.innerHTML = `<p>По запросу "${escapeHtml(query)}" ничего не найдено.</p>`;
                if (this.paginationContainer) this.paginationContainer.innerHTML = '';
                return;
            }

            const total = results.length;
            const perPage = CONFIG.ITEMS_PER_PAGE;
            const totalPages = Math.ceil(total / perPage);
            const currentPage = Math.min(this.currentPage, totalPages);
            const start = (currentPage - 1) * perPage;
            const end = Math.min(start + perPage, total);
            const pageItems = results.slice(start, end);

            this.container.innerHTML = pageItems.map(a => this.createCardHTML(a)).join('');
            const baseUrl = this.buildBaseUrl();
            this.renderPagination(totalPages, currentPage, baseUrl);
            this.updateFavoriteButtons();
        }

        // ---------- Пагинация ----------
        renderPagination(totalPages, currentPage, baseUrl) {
            if (!this.paginationContainer) return;
            if (totalPages <= 1) {
                this.paginationContainer.innerHTML = '';
                return;
            }

            let html = '<div class="pagination-wrapper">';

            if (currentPage > 1) {
                html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}" class="page-link prev" aria-label="Предыдущая страница">← Назад</a>`;
            } else {
                html += `<span class="page-link prev disabled" aria-disabled="true">← Назад</span>`;
            }

            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);
            if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (startPage > 1) {
                html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=1" class="page-link" aria-label="Страница 1">1</a>`;
                if (startPage > 2) html += `<span class="page-dots">…</span>`;
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i === currentPage) {
                    html += `<span class="page-link active" aria-current="page">${i}</span>`;
                } else {
                    html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${i}" class="page-link" aria-label="Страница ${i}">${i}</a>`;
                }
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) html += `<span class="page-dots">…</span>`;
                html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${totalPages}" class="page-link" aria-label="Страница ${totalPages}">${totalPages}</a>`;
            }

            if (currentPage < totalPages) {
                html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}" class="page-link next" aria-label="Следующая страница">Вперёд →</a>`;
            } else {
                html += `<span class="page-link next disabled" aria-disabled="true">Вперёд →</span>`;
            }

            html += '</div>';
            this.paginationContainer.innerHTML = html;
        }

        // ---------- Построение URL ----------
        buildBaseUrl() {
            const path = window.location.pathname;
            const params = new URLSearchParams();
            if (this.currentTag) params.set('tag', this.currentTag);
            if (this.searchQuery) params.set('search', this.searchQuery);
            const queryString = params.toString();
            return queryString ? `${path}?${queryString}` : path;
        }

        // ---------- Рендер статьи ----------
        async renderArticle(article) {
            if (this.filterTags) this.filterTags.innerHTML = '';

            const existingArticle = this.container.querySelector(`.full-article[data-id="${article.id}"]`);
            if (existingArticle) {
                document.title = `${article.metaTitle || article.title} | ${article.category} | XaosLand`;
                this.updateMetaTags(article.metaDescription || article.excerpt);
                this.initComments(article.id);
                this.renderRelatedArticles(article);
                this.addArticleJsonLd(article);
                this.renderShareButtons(article);   // ← добавить
                this.enhanceCodeBlocks();      // ← добавьте
                this.buildTableOfContents();   // ← добавьте
                return;
            }

            if (navigator.share) {
                const shareBtn = document.createElement('button');
                shareBtn.className = 'share-btn native';
                shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> <span>Поделиться</span>';
                shareBtn.addEventListener('click', async () => {
                    try {
                        await navigator.share({
                            title: article.title,
                            text: article.excerpt,
                            url: window.location.href
                        });
                    } catch (e) { /* user cancelled */ }
                });
                // Вставить первым в .share-buttons
            }

            const title = escapeHtml(article.title);
            const metaTitle = article.metaTitle ? escapeHtml(article.metaTitle) : title;
            const metaDesc = article.metaDescription ? escapeHtml(article.metaDescription) : escapeHtml(article.excerpt);
            document.title = `${metaTitle} | ${escapeHtml(article.category)} | XaosLand`;
            this.updateMetaTags(metaDesc);

            let imageHtml = '';
            if (article.image) {
                imageHtml = `<img src="${escapeHtml(article.image)}" alt="${title}" class="article-header-image" loading="lazy">`;
            }

            const dateStr = formatDate(article.date);
            const tagsHtml = article.tags.map(t => `<span class="tag" data-tag="${escapeAttr(t)}">${escapeHtml(t)}</span>`).join(' ');

            this.container.innerHTML = `
            <article class="full-article" data-id="${article.id}">
                    ${imageHtml}
                    <h1>${title}</h1>
                    <div class="article-meta">
                        <span><i class="far fa-calendar"></i> ${dateStr}</span>
                        <span><i class="fas fa-clock"></i> ${escapeHtml(article.readTime)} мин чтения</span>
                        <span><i class="fas fa-tags"></i> ${tagsHtml}</span>
                        <button class="favorite-btn" data-id="${escapeAttr(article.id)}" aria-label="Добавить в избранное"><i class="fas fa-star"></i></button>
                    </div>
                    <div class="article-body">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
</div>

          <div class="share-section">
    <div class="share-title"><i class="fas fa-share-alt"></i> Поделиться:</div>
    <div class="share-buttons" id="share-buttons-${article.id}"></div>
</div>

                    <div class="related-articles" id="related-articles"></div>

                    <div class="comments-section" id="comments-${escapeHtml(article.id)}">
                        <h3 class="comments-title"><i class="fas fa-comments"></i> Комментарии</h3>
                        <div class="comments-placeholder"></div>
                    </div>
                </article>
            `;

            try {
                if (typeof marked === 'undefined') {
                    throw new Error('Библиотека marked не загружена');
                }
                const slug = getSlugFromCategory(article.category);
                const response = await fetch(`/data/content/${slug}/${article.id}.md`);

                if (!response.ok) throw new Error('Не удалось загрузить текст статьи');
                const markdownText = await response.text();
                const htmlContent = marked.parse(stripFrontmatter(markdownText));
                const body = this.container.querySelector('.article-body');
                if (body) body.innerHTML = htmlContent;
                this.enhanceCodeBlocks();
                this.buildTableOfContents();
                this.renderShareButtons(article);
                this.initComments(article.id);
                this.renderRelatedArticles(article);
                this.addArticleJsonLd(article);

            } catch (error) {
                const body = this.container.querySelector('.article-body');
                if (body) {
                    body.innerHTML = '<p style="color: red;">Ошибка загрузки текста. Попробуйте позже.</p>';
                }
                showNotification('Ошибка загрузки содержимого статьи', 'error');
            }
        }

        // ---------- Похожие статьи ----------
        renderRelatedArticles(article) {
            const container = document.getElementById('related-articles');
            if (!container) return;
            const related = this.articles
                .filter(a => a.id !== article.id && a.category === article.category)
                .slice(0, 3);
            if (related.length === 0) {
                container.innerHTML = '';
                return;
            }
            const grid = document.createElement('div');
            grid.className = 'related-grid';
            grid.innerHTML = related.map(a => {
                const slug = getSlugFromCategory(a.category);
                return `
                    <a href="/${slug}/${encodeURIComponent(a.id)}/" class="related-card">
                        <div class="related-title">${escapeHtml(a.title)}</div>
                        <div class="related-category">${escapeHtml(a.category)}</div>
                    </a>
                `;
            }).join('');
            container.innerHTML = '<h3><i class="fas fa-link"></i> Похожие статьи</h3>';
            container.appendChild(grid);
        }

        // ---------- JSON-LD статья ----------
        addArticleJsonLd(article) {
            const existing = document.querySelector('script#article-jsonld');
            if (existing) existing.remove();
            const script = document.createElement('script');
            script.id = 'article-jsonld';
            script.type = 'application/ld+json';
            const data = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": article.title,
                "description": article.excerpt,
                "datePublished": article.date,
                "author": {
                    "@type": "Organization",
                    "name": "XaosLand"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "XaosLand",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://xaosland.ru/icons/icon-192.png"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": window.location.href
                }
            };
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        }

        // ---------- Фильтр по тегам ----------
        filterByTag(tag) {
            if (tag === '') {
                this.currentTag = null;
            } else if (this.currentTag === tag) {
                this.currentTag = null;
            } else {
                this.currentTag = tag;
            }
            this.currentPage = 1;
            const url = new URL(window.location);
            if (this.currentTag) {
                url.searchParams.set('tag', this.currentTag);
            } else {
                url.searchParams.delete('tag');
            }
            window.history.pushState(null, '', url);
            this.render();
        }

        // ---------- Кнопки фильтров ----------
        renderFilterTags(articles) {
            const filterContainer = this.filterTags;
            if (!filterContainer) return;
            const allTags = new Set();
            articles.forEach(a => a.tags.forEach(t => allTags.add(t)));
            if (allTags.size === 0) {
                filterContainer.innerHTML = '';
                return;
            }
            let html = '<span class="filter-label">Фильтр по тегам:</span>';
            allTags.forEach(tag => {
                const active = (this.currentTag === tag) ? ' active' : '';
                html += `<button class="filter-btn${active}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
            });
            if (this.currentTag) {
                html += `<button class="filter-btn" data-tag="">✕ Сбросить</button>`;
            }
            filterContainer.innerHTML = html;
        }

        // ---------- Создание карточки ----------
        createCardHTML(article) {
            const iconClass = getIconForCategory(article.category);
            const slug = getSlugFromCategory(article.category);
            const link = `/${slug}/${encodeURIComponent(article.id)}/`;
            const title = escapeHtml(article.title);
            const excerpt = escapeHtml(article.excerpt);
            const category = escapeHtml(article.category);
            const dateStr = formatDate(article.date);
            const readTime = escapeHtml(article.readTime);

            let imageHtml = '';
            if (article.image) {
                imageHtml = `<img src="${escapeHtml(article.image)}" alt="${title}" loading="lazy" decoding="async">`;
            } else {
                imageHtml = `<i class="${iconClass}"></i>`;
            }

            const readMoreText = this.getReadMoreText(article.category);

            return `
                <article class="article-card">
                    <div class="article-image">
                        <div class="article-category">${category}</div>
                        ${imageHtml}
                    </div>
                    <div class="article-content">
                        <h2 class="article-title">${title}</h2>
                        <p class="article-excerpt">${excerpt}</p>
                        <div class="article-meta">
                            <span class="article-date"><i class="far fa-calendar"></i> ${dateStr}</span>
                            <span class="read-time"><i class="fas fa-clock"></i> ${readTime} мин</span>
                        </div>
                        <a href="${link}" class="read-more">${readMoreText} <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `;
        }

        // ---------- Текст для кнопки ----------
        getReadMoreText(category) {
            const map = {
                'Игры': 'Играть',
                'Программы': 'Скачать',
                'GitHub проекты': 'Перейти',
                'Ozon находки': 'Посмотреть'
            };
            return map[category] || 'Читать далее';
        }

        // ---------- Популярное ----------
        renderPopular() {
            const popular = this.articles.filter(a => a.popular === true);
            if (!this.popularList) return;
            if (popular.length === 0) {
                this.popularList.innerHTML = '<li>Нет популярных статей</li>';
                return;
            }
            this.popularList.innerHTML = popular.map(a => {
                const slug = getSlugFromCategory(a.category);
                return `<li><a href="/${slug}/${encodeURIComponent(a.id)}/">${escapeHtml(a.title)}</a></li>`;
            }).join('');
        }

        // ---------- Категории ----------
        renderCategories() {
            const catList = this.categoryList;
            if (!catList) return;
            const counts = {};
            this.articles.forEach(a => {
                counts[a.category] = (counts[a.category] || 0) + 1;
            });
            const sorted = Object.keys(counts).sort();
            catList.innerHTML = sorted.map(cat => {
                const iconClass = getIconForCategory(cat);
                const slug = getSlugFromCategory(cat);
                const catEscaped = escapeHtml(cat);
                return `<li><a href="/${slug}/"><i class="${iconClass}"></i> ${catEscaped} <span class="count-badge">${counts[cat]}</span></a></li>`;
            }).join('');
        }

        // ---------- Облако тегов ----------
        renderTagCloud() {
            if (!this.tagCloud) return;
            const tagCounts = {};
            this.articles.forEach(a => {
                a.tags.forEach(t => {
                    tagCounts[t] = (tagCounts[t] || 0) + 1;
                });
            });
            const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
            this.tagCloud.innerHTML = tags.map(([tag, count]) => {
                return `<a href="/?tag=${encodeURIComponent(tag)}" class="tag-link">${escapeHtml(tag)} <span class="count">(${count})</span></a>`;
            }).join('');
        }

        // ---------- Хлебные крошки ----------
        renderBreadcrumb() {
            const bc = this.breadcrumb;
            if (!bc) return;
            let parts = [];
            if (this.searchQuery) {
                parts.push({ name: `Поиск: "${this.searchQuery}"`, url: '#' });
            } else if (this.staticPage) {
                const pageNames = {
                    'about': 'О блоге',
                    'contacts': 'Контакты',
                    'privacy': 'Политика конфиденциальности'
                };
                parts.push({ name: pageNames[this.staticPage] || this.staticPage, url: '#' });
            } else {
                if (this.currentCategory) {
                    const slug = getSlugFromCategory(this.currentCategory);
                    parts.push({ name: this.currentCategory, url: `/${slug}/` });
                }
                if (this.currentArticleId) {
                    const article = this.articles.find(a => a.id === this.currentArticleId && a.category === this.currentCategory);
                    if (article) {
                        const slug = getSlugFromCategory(this.currentCategory);
                        parts.push({ name: article.title, url: `/${slug}/${encodeURIComponent(article.id)}/` });
                    }
                }
                if (this.currentTag) {
                    parts.push({ name: `#${this.currentTag}`, url: '#' });
                }
            }

            let html = '<a href="/">Главная</a>';
            parts.forEach((p, index) => {
                html += ` <span class="separator">›</span> `;
                if (index === parts.length - 1) {
                    html += `<span class="current">${escapeHtml(p.name)}</span>`;
                } else {
                    html += `<a href="${escapeHtml(p.url)}">${escapeHtml(p.name)}</a>`;
                }
            });
            bc.innerHTML = html;

            this.addBreadcrumbJsonLd(parts);
        }

        addBreadcrumbJsonLd(parts) {
            const existing = document.querySelector('script#breadcrumb-jsonld');
            if (existing) existing.remove();
            const script = document.createElement('script');
            script.id = 'breadcrumb-jsonld';
            script.type = 'application/ld+json';
            const items = [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": window.location.origin + '/'
                }
            ];
            parts.forEach((p, i) => {
                items.push({
                    "@type": "ListItem",
                    "position": i + 2,
                    "name": String(p.name).replace(/<[^>]*>/g, ''),
                    "item": p.url === '#' ? window.location.href : new URL(p.url, window.location.origin).href
                });
            });
            const data = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": items
            };
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        }

        // ---------- Активный пункт меню ----------
        updateActiveNavLink() {
            const currentPath = window.location.pathname;
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '/') {
                    if (currentPath === '/' || currentPath === '') link.classList.add('active');
                } else {
                    if (href && href !== '/' && currentPath.startsWith(href)) link.classList.add('active');
                }
            });
        }

        // ---------- Мета-теги ----------
        updateMetaTags(content) {
            const text = content || CONFIG.DEFAULT_META_DESCRIPTION;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = text;

            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDesc = document.querySelector('meta[property="og:description"]');
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogTitle) ogTitle.content = document.title;
            if (ogDesc) ogDesc.content = text;
            if (ogUrl) ogUrl.content = window.location.href;
        }

        // ---------- Рендер навигации ----------
        async renderNavigation(data) {
            const navList = document.getElementById('nav-list');
            if (!navList) return;
            if (!data) {
                navList.innerHTML = `
                    <li><a href="/" class="nav-link active"><i class="fas fa-home"></i> Главная</a></li>
                    <li><a href="/news/" class="nav-link"><i class="fas fa-bolt"></i> Новости</a></li>
                    <li><a href="/articles/" class="nav-link"><i class="fas fa-newspaper"></i> Статьи</a></li>
                    <li><a href="/programs/" class="nav-link"><i class="fas fa-robot"></i> Программы</a></li>
                    <li><a href="/games/" class="nav-link"><i class="fas fa-gamepad"></i> Игры</a></li>
                    <li><a href="/github/" class="nav-link"><i class="fas fa-code"></i> GitHub проекты</a></li>
                    <li><a href="/ozon/" class="nav-link"><i class="fas fa-shopping-bag"></i> Ozon находки</a></li>
                `;
                this.updateActiveNavLink();
                return;
            }

            let html = '';
            data.items.forEach(item => {
                const activeClass = item.active ? ' active' : '';
                html += `
                    <li>
                        <a href="${escapeHtml(item.url)}" class="nav-link${activeClass}">
                            <i class="${escapeHtml(item.icon)}"></i> ${escapeHtml(item.label)}
                        </a>
                    </li>
                `;
            });
            navList.innerHTML = html;
            this.updateActiveNavLink();
        }

        // ---------- Футер ----------
        async renderFooter(data) {
            const footerContainer = document.getElementById('footer');
            if (!footerContainer) return;

            if (!data) {
                footerContainer.innerHTML = `
                    <div class="container">
                        <div class="copyright">
                            <p><i class="fas fa-code"></i> © 1998-${new Date().getFullYear()} XaosLand | IT-блог о технологиях</p>
                        </div>
                    </div>
                `;
                return;
            }

            let html = '<div class="container">';
            html += '<div class="footer-content">';

            const social = data.social;
            html += `
                <div class="footer-column">
                    <h4 class="footer-column-title"><i class="fas fa-users"></i> ${escapeHtml(social.title)}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px;">${escapeHtml(social.subtitle)}</p>
                    <div class="social-links">
            `;
            social.links.forEach(link => {
                html += `<a href="${escapeHtml(link.url)}" class="social-link" aria-label="${escapeHtml(link.label)}"><i class="${escapeHtml(link.icon)}"></i></a>`;
            });
            html += '</div></div>';

            data.columns.forEach(column => {
                html += `
                    <div class="footer-column">
                        <h4 class="footer-column-title"><i class="${escapeHtml(column.icon)}"></i> ${escapeHtml(column.title)}</h4>
                        <ul class="footer-links">
                `;
                column.links.forEach(link => {
                    html += `<li><a href="${escapeHtml(link.url)}"><i class="${escapeHtml(link.icon)}"></i> ${escapeHtml(link.text)}</a></li>`;
                });
                html += '</ul></div>';
            });

            html += `
                <div class="footer-column">
                    <h4 class="footer-column-title"><i class="fas fa-info-circle"></i> Информация</h4>
                    <ul class="footer-links">
                        <li><a href="/about/"><i class="fas fa-user"></i> О блоге</a></li>
                        <li><a href="/contacts/"><i class="fas fa-envelope"></i> Контакты</a></li>
                        <li><a href="/privacy/"><i class="fas fa-shield-alt"></i> Политика конфиденциальности</a></li>
                    </ul>
                </div>
            `;

            html += '</div>';

            const year = new Date().getFullYear();
            const copyrightText = data.copyright.text.replace(/\{year\}/g, year);
            html += `
                <div class="copyright">
                    <p><i class="fas fa-code"></i> ${escapeHtml(copyrightText)}</p>
                    <p class="small-note"><i class="fas fa-exclamation-triangle"></i> ${escapeHtml(data.copyright.note)}</p>
                </div>
            `;
            html += '</div>';

            footerContainer.innerHTML = html;
        }

        // ---------- Обновление года ----------
        updateCopyrightYear() {
            const yearSpan = document.querySelector('.copyright-year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        }
// ---------- Кнопки копирования кода ----------
        enhanceCodeBlocks() {
            const blocks = document.querySelectorAll('.article-body pre');
            blocks.forEach((pre) => {
                // Пропускаем, если кнопка уже есть
                if (pre.querySelector('.code-copy-btn')) return;

                const btn = document.createElement('button');
                btn.className = 'code-copy-btn';
                btn.type = 'button';
                btn.textContent = 'Копировать';

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const codeEl = pre.querySelector('code') || pre;
                    const text = codeEl.innerText;

                    const onSuccess = () => {
                        btn.textContent = 'Скопировано';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = 'Копировать';
                            btn.classList.remove('copied');
                        }, 1500);
                    };

                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
                            this.fallbackCopyText(text);
                            onSuccess();
                        });
                    } else {
                        this.fallbackCopyText(text);
                        onSuccess();
                    }
                });

                pre.appendChild(btn);
            });
        }
// ---------- Оглавление статьи ----------
        buildTableOfContents() {
            const body = document.querySelector('.article-body');
            if (!body) return;

            // Удаляем старое TOC, если есть
            const oldToc = body.querySelector('.article-toc');
            if (oldToc) oldToc.remove();

            const headings = body.querySelectorAll('h2, h3');
            if (headings.length < 3) return; // нет смысла в оглавлении

            // Проставляем id и сдвиги для sticky-шапки
            const items = [];
            headings.forEach((h, i) => {
                // Если у заголовка нет id — генерируем
                if (!h.id) {
                    const slug = h.textContent
                        .toLowerCase()
                        .trim()
                        .replace(/[^\wа-яё\s-]/gi, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 50);
                    h.id = `toc-${i}-${slug || 'section'}`;
                }
                items.push({
                    id: h.id,
                    text: h.textContent.trim(),
                    level: h.tagName === 'H3' ? 3 : 2
                });
            });

            const nav = document.createElement('nav');
            nav.className = 'article-toc';
            nav.setAttribute('aria-label', 'Содержание статьи');

            const title = document.createElement('div');
            title.className = 'article-toc-title';
            title.innerHTML = '<i class="fas fa-list-ul"></i> Содержание';

            const ul = document.createElement('ul');
            items.forEach((it) => {
                const li = document.createElement('li');
                if (it.level === 3) li.className = 'toc-h3';
                const a = document.createElement('a');
                a.href = `#${it.id}`;
                a.textContent = it.text;
                // Плавный скролл без изменения URL-хэша в SPA
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(it.id);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                li.appendChild(a);
                ul.appendChild(li);
            });

            nav.appendChild(title);
            nav.appendChild(ul);

            // Вставляем TOC в самое начало article-body
            body.insertBefore(nav, body.firstChild);
        }
        fallbackCopyText(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try { document.execCommand('copy'); } catch (e) { /* ignore */ }
            document.body.removeChild(textarea);
        }
        // ---------- Кнопки "Поделиться" (адаптивно) ----------
        renderShareButtons(article) {
            const container = document.getElementById(`share-buttons-${article.id}`);
            if (!container) return;

            const url = window.location.href;
            const title = article.title;
            const isMobile = matchMedia('(hover: none)').matches ||
                /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

            // На мобилке + есть Web Share API — одна нативная кнопка
            if (isMobile && navigator.share) {
                const nativeBtn = document.createElement('button');
                nativeBtn.type = 'button';
                nativeBtn.className = 'share-btn native';
                nativeBtn.innerHTML = '<i class="fas fa-share-alt"></i> <span>Поделиться</span>';
                nativeBtn.addEventListener('click', async () => {
                    try {
                        await navigator.share({
                            title: title,
                            text: article.excerpt || '',
                            url: url
                        });
                    } catch (e) {
                        // AbortError = пользователь закрыл меню, не ошибка
                        if (e.name !== 'AbortError') {
                            this.copyToClipboardFallback(url);
                            showNotification('Ссылка скопирована', 'success');
                        }
                    }
                });
                container.appendChild(nativeBtn);
            } else {
                // Десктоп: классические кнопки соцсетей
                const socials = [
                    { cls: 'vk',       icon: 'fab fa-vk',            label: 'ВКонтакте',
                        href: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
                    { cls: 'telegram', icon: 'fab fa-telegram-plane', label: 'Telegram',
                        href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
                    { cls: 'twitter',  icon: 'fab fa-twitter',        label: 'Twitter',
                        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
                    { cls: 'facebook', icon: 'fab fa-facebook-f',     label: 'Facebook',
                        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
                    { cls: 'whatsapp', icon: 'fab fa-whatsapp',       label: 'WhatsApp',
                        href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}` }
                ];

                socials.forEach(s => {
                    const a = document.createElement('a');
                    a.href = s.href;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = `share-btn ${s.cls}`;
                    a.innerHTML = `<i class="${s.icon}"></i> <span>${s.label}</span>`;
                    container.appendChild(a);
                });
            }

            // Кнопка "Копировать ссылку" — всегда
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'share-btn copy';
            copyBtn.dataset.url = url;
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Копировать ссылку</span>';
            copyBtn.addEventListener('click', () => {
                if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        copyBtn.classList.add('copied');
                        showNotification('Ссылка скопирована', 'success');
                        setTimeout(() => copyBtn.classList.remove('copied'), 2000);
                    }).catch(() => {
                        this.copyToClipboardFallback(url);
                        showNotification('Ссылка скопирована', 'success');
                    });
                } else {
                    this.copyToClipboardFallback(url);
                    showNotification('Ссылка скопирована', 'success');
                }
            });
            container.appendChild(copyBtn);
        }

        copyToClipboardFallback(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try { document.execCommand('copy'); } catch (e) { /* ignore */ }
            document.body.removeChild(textarea);
        }

        // ---------- Инициализация комментариев ----------
        initComments(articleId) {
            const container = document.querySelector(`#comments-${articleId} .comments-placeholder`);
            if (!container) return;
            const oldScript = container.querySelector('script');
            if (oldScript) oldScript.remove();
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.setAttribute('data-repo', 'xaosland/chat');
            script.setAttribute('data-repo-id', 'R_kgDOUHxxbQ');
            script.setAttribute('data-category', 'General');
            script.setAttribute('data-category-id', 'DIC_kwDOUHxxbc4DEbc3');
            script.setAttribute('data-mapping', 'pathname');
            script.setAttribute('data-strict', '0');
            script.setAttribute('data-reactions-enabled', '1');
            script.setAttribute('data-emit-metadata', '0');
            script.setAttribute('data-input-position', 'top');
            script.setAttribute('data-theme', 'noborder_dark');
            script.setAttribute('data-lang', 'ru');
            script.setAttribute('crossorigin', 'anonymous');
            script.async = true;
            container.appendChild(script);
        }
    }

    // ---------- Запуск ----------
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(reg => console.log('Service Worker registered:', reg.scope))
                    .catch(err => console.log('Service Worker registration failed:', err));
            });
        }
    });
})();

// ---------- Копирование в буфер ----------
function copyToClipboard(button) {
    const url = button.dataset.url;
    if (!url) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => showCopiedFeedback(button))
            .catch(() => fallbackCopy(url, button));
    } else {
        fallbackCopy(url, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopiedFeedback(button);
    } catch (err) {
        showNotification('Не удалось скопировать ссылку', 'error');
    }
    document.body.removeChild(textarea);
}

function showCopiedFeedback(button) {
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 2000);
}

# Milon Mining — redesign 2026

Полностью пересобранная статическая версия сайта Milon Mining. Информационная архитектура и UX ориентированы на уровень Atlas Development, визуальный язык и контент остаются самостоятельными и основаны на материалах Milon.

## Запуск

Требуется Node.js 20+.

```bash
npm ci
npm run dev
```

## Production-сборка

```bash
npm run build
```

Готовая статическая версия создаётся в `dist/`.

## Структура

- `index.html` — главная;
- `apartments.html` — отдельный каталог квартир;
- `milon-tower.html`, `milon-hills.html`, `milon-plaza.html`, `milon-townhouse.html` — страницы проектов;
- `about.html` — история компании;
- `parking.html` — полноценная страница паркинга;
- `privacy-policy.html` — рабочая юридическая структура;
- `ru/offers/`, `hy/offers/` — локализованные страницы действующих предложений и четыре отдельные страницы акций;
- `styles.css` — единая адаптивная дизайн-система;
- `site-data.js` — проекты, контакты, опубликованный инвентарь и единая конфигурация предложений;
- `site.js` — рендеринг HY/RU, фильтры, каталог, этажи, ипотечный калькулятор, карусели, формы и модальные окна;
- `components/milon-map/` — полноширинная интерактивная карта района Milon Tower;
- `bitrix24-integration.example.js` — пример подключения безопасного backend endpoint;
- `qa/render-smoke.mjs` — автоматическая проверка страниц, данных, фильтров и локальных материалов.

## Bitrix24

Frontend формирует JSON с полями `name`, `phone`, `preferred_contact_method`, `project`, `apartment_id`, `source_page`, `language`, `consent`, `created_at` и отправляет его на `window.MILON_CONFIG.leadEndpoint`.

Секретный webhook Bitrix24 нельзя помещать во frontend. Нужен собственный backend endpoint, который валидирует запрос и создаёт лид/сделку. До подключения endpoint форма не имитирует успех, а показывает честный статус и телефон отдела продаж.

## Данные квартир

В исходном ZIP найден один набор из 8 квартир, который был продублирован между проектами. В новой версии он опубликован только для Milon Tower. Для Hills, Plaza и Town House выведены честные пустые/статусные состояния до получения CRM-выгрузки.

Полный итог и список недостающих материалов находятся в `DELIVERY-REPORT-RU.md`.

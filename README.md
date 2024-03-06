# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура



## Описание данных

### Базовые компоненты

#### Класс EventEmiter
Позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Класс имеет методы `on`, `off`, `emit` - для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы `onAll` и `offAll` - для подписки на все события и сброса всех
подписчиков.

### Компоненты модели данных

#### Класс `Modal`

#### Класс `Catalog`
Отвечает за хранение списка товаров, который хранит в поле `data`.
Метод `set data` принимает на вход массив товаров и записывает их в `data`, а метод `get data` возвращает этот массив.
Также имеет поле `selectedItem`, в котором хранится выбранный товар. Его значение можно указать с помощью метода `set selectedItem` и получить с помощью `get selectedItem`.

#### Класс `Product`
Хранит данные об отдельном товаре в полях `id`, `description`, `image`, `title`,  `category`, `price`.
Метод `setData` устанавливает значение полей, а метод `getData` позволяет получить эти данные в виде объекта.

#### Класс `Cart`
Отвечает за бизнес логику корзины и хранит ее данные в полях `data` и `totalPrice`.
- `data` - список товаров, добавленных в корзину,
- `totalPrice` - итоговая сумма заказа.
Для каждого из полей класса предусмотрен геттер `get data`/`get totalPrice` и сеттер `set data`/`set totalPrice` для управления этими данными.
Также класс имеет методы `removeItem` и `addItem`:
- `removeItem` - удаляет выбранный товар из корзины,
- `addItem` - добавляет выбранный товар в корзину.

#### Класс `Order`
Хранит данные о заказе пользователя:
- `adress` - адрес доставки,
- `email` - электронная почта заказчика,
- `phone` - телефон заказчика,
- `payment` - предпочтительный способ оплаты,
- `price` - сумма заказа,
- `items` - состав заказа.
Метод `setData` позволяет записать данные пользователя в соответствующие поля.

#### Класс `Modal`
Отвечает за логику работы модального окна.
Поле `state` хранит состояние объекта в виде булева значения.
У `state` имеются свои геттер и сеттер для получения состояния компонента и установки нового.
Поле `content` хранит контент для наполнения компонента и меет свои геттер и сеттер для управления им.

### Компоненты представления

#### Класс CatalogUI
Выводит на главной странице каталог товаров.
Имеет поле `items`, содержащее массив объектов товаров.

#### Класс ProductUI
Отображает карточку товара.
Поля `name`, `image`, `price`, `description`, `category` - данные о товаре.
Имеет методы `showCard` и `addToCart`:
- `showCard` - открывает модальное окно с подробным описанием товара,
- `addToCart` - добавляет выбранный товар в корзину.

#### Класс CartUI
Выводит на экран модальное окно с корзиной товаров.
Имеет методы `removeItem`, `clearCart` и `checkout`:
- `removeItem` - удаляет из списка выбранный товар,
- `clearCart` - удаляет из списка все товары,
- `checkout` - открывает модальное окно с формой оформления заказа.

#### Класс FormUI
Отображает форму оформления заказа.
Принимает введенные пользователем данные в поля:
- `adress` - адрес доставки,
- `email` - электронная почта,
- `phone` - номер телефона.
Также имеет поле `paymentMethod` - выбор способа оплаты из двух значений: `card` | `cash`.

### Список событий
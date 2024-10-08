# Web-larek

Приложение с возможностью создания заказа и его пошагового оформления  
[Ссылка на проект](https://georgymedvedsky.github.io/web-larek-frontend/)

## Функционал
* Просмотр детальной информации о товарах
* Возможность добавления / удаления товара в корзину
* Оформление собранного заказа в несколько шагов

## Используемые технологии
* HTML5
* Sass
* TypeScript
* Webpack
* Rest API

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

## Данные и типы данных

Товар

```
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price
}
```

Форма заполнения заказа

```
interface IOrderForm {
    payment: string; 
    email: string; 
    phone: string; 
    address: string;
}
```

Сформированный заказ

```
interface IOrder extends IOrderForm {
    total: number; 
    items: string[]; 
}
```

Страница

```
export interface IPage {
    catalog: HTMLElement[];
    wrapper: HTMLElement;
    basket: HTMLElement;
}
```

Ответ Api

```
type ApiListResponse<T> = {
    total: number,
    items: T[]
}
```

Ошибки форм

```
type FormErrors = Partial<Record<keyof IOrder, string>>
```

Базовая карточка товара

```
type TCardItem = Pick<IProduct, 'title' | 'category'| 'image' | 'price'>;
```

Изменение каталога

```
type CatalogChange = IProduct[];
```

## Архитектура

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер,
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие,
- `emit` - инициализация события,
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Model
Абстрактный базовый класс, отвечающий за хранение данных
Принимает в конструктор объекты данных и событий

#### Класс View
Абстрактный базовый класс, отвечающий за отображение контента на странице.
Принимает в конструктор HTML элемент в виде контейнера для контента.
Имеет ряд методов для управления и изменения контейнера и дочерних элементов

### Слой данных
Все классы слоя данных отвечают за биснес-логику приложения

#### Класс ProductItem
Отвечает за хранение данных о товаре, которые принимает в конструктор, не реализует возможность изменения этих данных:
- `id` - идентификатор товара,
- `description` - описание товара,
- `image` - изображение товара,
- `title` - название товара,
- `category` - категория, к которой принадлежит товар,
- `price` - цена товара

#### Класс AppState
Основная бизнес-логика приложения. Класс отвечает за хранение и изменение таких состояний, как:
- `catalog` - каталог товаров,
- `cart` - объект корзины, состоящий из коллекции добавленных товаров в поле `items` и итоговой стоимости в поле `totalPrice`,
- `order` - данные о заказе пользователя, которые в будущем отправляются на сервер,
- `formErrors` - поле для хранения сообщений об ошибках валидации

Класс имеет методы управления всеми хранящимися в нем данными:

- `setCatalog` - принимает параметром массив товаров и генерирует на его основе новый массив, который записывает в поле `catalog`, генерируя событие `CATALOG_UPDATE`(обновление каталога),

- `isAddedToCart` - принимает параметром объект товара и проверяет его наличие в корзине, возвращая `true` или `false`,

- `addCartItem` - принимает параметром объект товара и добавляет его в поле `items` как элемент массива,

- `removeCartItem` - принимает параметром идентификатор товара в виде строки и перезаписывает массив товаров в поле `items`, исключая из него найденный объект,

- `setTotalPrice` - принимает параметром массив товаров, высчитывает на его основе итоговую стоимость заказа и записывает полученное значение в поле `totalPrice`,

- `clearCart` - очищает корзину, записывая в поле `items` пустой массив и обнуляет итоговую стоимость,

- `clearOrder` - очищает объект заказа,

- `setOrderField` - записывает данные из полей формы в поле `order`,

- `validateOrder` - отвечает за валидацию полей

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Отвечает за отображение и функционал модального окна.
 Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- `constructor` - конструктор принимает содержимое темплейт элемента для его отображения и экземпляр класса `EventEmitter` для возможности инициации событий.
Поля класса:
- `content` - содержимое модального окна,
- `events` - брокер событий.

#### Класс Page
Отвечает за отображение и обработку таких основных элементов на начальной странице, как:
- `catalog` - каталог на начальном экране приложения,
- `counter` - счетчик добавленных в корзину товаров,
- `cart` - кнопка корзины, позволяющая получить доступ к экрану корзины,
- `wrapper` - обертка, позволяющая ограничить прокрутку страницы при открытом модальном окне.

#### Класс Card, CardItem
Отвечают за вариативность отрисовки всех элементов карточек товаров.
Классы `CardItem` расширяют `Card`, адаптируя отображение карточки под определенные условия, заданные в приложении.
Данные для отрисовки получают с помощью геттеров и сеттеров

#### Класс Cart
Отвечает за отображение корзины и имеет два сеттера для указания значений `items` - список товаров, и `total` - итоговая стоимость корзины

#### Класс Form
Отвечают за отображение форм на странице и имеет методы и поля для валидации введенных данных

#### Классы OrderForm, ContactsForm
Расширяют класс `Form`, отвечая за отрисовку каждой из форм

#### Класс Success
Отвечает за отображение уведомления о созданном заказе
Имеет поле `total`, в которое записывается итоговая стоимость созданного заказа

### Слой коммуникации

#### Класс LarekApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.
- `getProductItem` - возвращает объект товара в результате запроса,
- `getProductList` - возвращает массив товаров

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\

События в приложении

```
export enum Events {
    CATALOG_UPDATE = 'catalog:update',
    CARD_SELECT = 'card:select',
    CART_UPDATE = 'cart:update',
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
    CART_OPEN = 'cart:open',
    FORM_OPEN = 'form:open',
    FORM_SUBMIT = 'form:submit',
    INPUT_CHANGE = 'input:change',
    FORM_ERRORS_CHANGE = 'formErrors:change',
    ORDER_SUBMIT = 'order:submit'
}
```

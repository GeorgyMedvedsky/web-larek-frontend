import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Events, IProduct, CatalogChangeEvent } from './types';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { CardItem, CardItemCompact } from './components/common/Card';
import { Modal } from './components/common/Modal';
import { Cart } from './components/common/Cart';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cart = new Cart(cloneTemplate(basketTemplate), events);

// Обновить каталог
events.on<CatalogChangeEvent>(Events.CATALOG_UPDATE, () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CardItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit(Events.CARD_SELECT, item)
        });
        return card.render(item);
    });
});

// Открыть карточку
events.on(Events.CARD_SELECT, (item: IProduct) => {
    const card = new CardItem(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit(Events.CART_UPDATE, item);
            modal.close();
        }
    });
    if(item.price === null) {
        card.setDisabled(card.button, true);
        card.button = 'Недоступно';
    } else if (appData.isAddedToCart(item)) {
        card.setDisabled(card.button, true);
        card.button = 'Уже в корзине';
    } else {
        card.setDisabled(card.button, false);
        card.button = 'В корзину';
    }
    modal.render({
        content: card.render(item)
    });
});

// Обновить корзину
events.on(Events.CART_UPDATE, (item: IProduct | IProduct[]) => {
    if(Array.isArray(item)) {
        appData.clearCart();
        item.forEach((product: IProduct) => appData.addCartItem(product));
    } else {
        appData.addCartItem(item);
    }
    appData.setTotalPrice(appData.cart.items);
    cart.total = appData.cart.totalPrice;
    page.counter = appData.cart.items.length;
    cart.items = appData.cart.items.map(item => {
        const card = new CardItemCompact(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeCartItem(item.id);
                events.emit(Events.CART_UPDATE, appData.cart.items);
            }
        });
        return card.render({
            title: item.title,
            price: item.price
        });
    });
});

// Открыть корзину
events.on(Events.CART_OPEN, () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            cart.render()
        ])
    });
});

console.log(appData.order)
appData.order = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
}
console.log(appData.order)

// Блокируем прокрутку страницы если открыта модалка
events.on(Events.MODAL_OPEN, () => {
    page.locked = true;
});

// ... и разблокируем
events.on(Events.MODAL_CLOSE, () => {
    page.locked = false;
});

api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });
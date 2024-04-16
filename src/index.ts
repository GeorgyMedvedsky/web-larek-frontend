import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Events, IProduct } from './types';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardItem, CardItemCompact } from './components/common/Card';
import { CatalogChangeEvent } from './types/index';
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
events.on<CatalogChangeEvent>(Events.CATALOG_CHANGED, () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CardItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit(Events.CARD_SELECT, item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: `${item.price} синапсов`
        });
    });
});

// Открыть карточку
events.on(Events.CARD_SELECT, (item: IProduct) => {
    appData.setPreview(item);
    const card = new CardItem(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit(Events.CART_CHANGED, item);
            if(appData.isAddedToCart(item)) {
                card.setDisabled(card.button, true);
                card.button = 'Уже в корзине';
                modal.render({
                    content: card.render({
                        title: item.title,
                        image: item.image,
                        category: item.category,
                        price: `${item.price} синапсов`,
                        description: item.description
                    })
                });
            } else {
                card.setDisabled(card.button, false);
                card.button = 'В корзину';
                modal.render({
                    content: card.render({
                        title: item.title,
                        image: item.image,
                        category: item.category,
                        price: `${item.price} синапсов`,
                        description: item.description
                    })
                });
            }
        }
    });
    card.button = 'В корзину';
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: `${item.price} синапсов`,
            description: item.description
        })
    });
});

// Обновить состав корзины
events.on(Events.CART_CHANGED, (item: IProduct) => {
    appData.addCartItem(item);
    appData.setTotalPrice(appData.cart.items);
    cart.total = `${appData.cart.totalPrice} синапсов`;
    page.counter = appData.cart.items.length;
    cart.items = appData.cart.items.map(item => {
        const card = new CardItemCompact(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeCartItem(item.id);
                appData.setTotalPrice(appData.cart.items);
                cart.total = `${appData.cart.totalPrice} синапсов`;
                page.counter = appData.cart.items.length;
                cart.items = appData.cart.items.map(item => {
                    const card = new CardItemCompact(cloneTemplate(cardBasketTemplate), {
                        onClick: () => {
                                appData.removeCartItem(item.id);
                                appData.setTotalPrice(appData.cart.items);
                                cart.total = `${appData.cart.totalPrice} синапсов`;
                                page.counter = appData.cart.items.length;
                                cart.items = appData.cart.items.map(item => card.render(item));
                        }
                    });
                    return card.render({
                        title: item.title,
                        price: `${item.price} синапсов`
                    });
                });
            }
        });
        return card.render({
            title: item.title,
            price: `${item.price} синапсов`
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
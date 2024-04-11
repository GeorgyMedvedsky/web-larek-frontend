import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Events, IProduct } from './types';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { CardItem } from './components/common/Card';
import { CatalogChangeEvent } from './types/index';
import { Modal } from './components/common/Modal';

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
    const card = new CardItem(cloneTemplate(cardPreviewTemplate));
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
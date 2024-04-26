import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL, categorySettings, formNames, formTemplates } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Events, IProduct, CatalogChange, IOrderForm, IOrder } from './types';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardItem } from './components/common/Card';
import { Modal } from './components/common/Modal';
import { Cart } from './components/common/Cart';
import { OrderForm, ContactsForm } from './components/common/Form';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

// Модель данных приложения
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(formTemplates.order), events);
const contactsForm = new ContactsForm(cloneTemplate(formTemplates.contacts), events);

// Обновить каталог
events.on<CatalogChange>(Events.CATALOG_UPDATE, () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CardItem(cloneTemplate(cardCatalogTemplate), categorySettings, {
            onClick: () => events.emit(Events.CARD_SELECT, item)
        });
        return card.render(item);
    });
});

// Открыть карточку
events.on(Events.CARD_SELECT, (item: IProduct) => {
    const card = new CardItem(cloneTemplate(cardPreviewTemplate), categorySettings, {
        onClick: () => {
            events.emit(Events.CART_UPDATE, item);
            events.emit(Events.CARD_SELECT, item);
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
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
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

// Открыть форму
events.on(Events.FORM_OPEN, () => {
    modal.render({
        content: orderForm.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы
events.on(Events.FORM_ERRORS_CHANGE, (errors: Partial<IOrderForm>) => {
    const { email, phone, address } = errors;
    orderForm.valid = !address;
    orderForm.errors = Object.values({address}).filter(i => !!i).join('; ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(Events.INPUT_CHANGE, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on(Events.FORM_SUBMIT, (formName: string) => {
    appData.order.total = appData.cart.totalPrice;
    appData.order.items = appData.cart.items.map(item => item.id)
    switch(formName) {
        case formNames.ORDER: {
            appData.order.payment = orderForm.payment.value;
            modal.render({
                content: contactsForm.render({
                    email: '',
                    phone: '',
                    valid: false,
                    errors: []
                })
            });
            break;
        }
        case formNames.CONTACTS: {
            events.emit(Events.ORDER_SUBMIT, appData.order);
            appData.clearCart();
            appData.clearOrder();
            events.emit(Events.CART_UPDATE, appData.cart.items);
            break;
        }
        default: console.error('Форма не найдена')
    }
});

events.on(Events.ORDER_SUBMIT, (data: IOrder) => {
    api.postOrder(data)
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate),  {
                onClick: () => {
                    modal.close();
                }
            });

            modal.render({
                content: success.render({
                    total: data.total
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
})

// Блокируем прокрутку страницы если открыта модалка
events.on(Events.MODAL_OPEN, () => {
    page.locked = true;
});

// ... и разблокируем
events.on(Events.MODAL_CLOSE, () => {
    page.locked = false;
});

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    api.getProductList()
        .then((res) => {
            appData.setCatalog.bind(appData);
            console.log(res)
        })
        .then(() => {
            loader.style.display = 'none';
        })
        .catch(err => {
            console.error(err);
            loader.style.display = 'none';
        });
});
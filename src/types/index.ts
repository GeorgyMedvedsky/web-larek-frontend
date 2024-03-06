export interface ICatalog {
    data: IProduct[];
    selectedItem: IProduct | null;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICart {
    data: IProduct[];
    totalPrice: number;
}

export interface IOrder {
    adress: string;
    email: string;
    phone: number;
    payment: string;
    price: number;
    items: string[];
}

export interface IModal<T> {
    state: boolean;
    content: T;
}

enum Events {
    CATALOG_UPDATE = 'catalog:changed',
    PRODUCT_SELECT = 'catalog:selected',
    PRODUCT_UPDATE = 'product:changed',
    CART_UPDATE = 'cart:changed',
    ORDER_UPDATE = 'order:changed',

    UI_PRODUCT_SELECT = 'ui:catalog-selected',
    UI_PRODUCT_SHOW = 'ui:product-show',
    UI_CART_SHOW = 'ui:cart-show',
    UI_FORM_SUBMIT = 'ui:form-submit',
    UI_MODAL_SHOW = 'ui:modal-show',
    UI_MODAL_HIDE = 'ui:modal-hide'
}
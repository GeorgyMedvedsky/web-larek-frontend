export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export interface IOrderForm {
    payment: string; 
    email: string; 
    phone: string; 
    address: string;
}

export interface IOrder extends IOrderForm {
    total: number; 
    items: string[]; 
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TCardItem = Pick<IProduct, 'title' | 'category'| 'image' | 'price'>;

export type CatalogChange = IProduct[];

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
export interface IAppState {
    catalog: IProduct[];
    cart: {
        items: IProduct[];
        totalPrice: number;
    }
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IPage {
    catalog: HTMLElement[];
    wrapper: HTMLElement;
    basket: HTMLElement;
}

export interface IModalData {
    content: HTMLElement;
}

export interface ICartView {
    items: HTMLElement[];
    total: number;
}

export type TCardItem = Pick<IProduct, 'title' | 'category'| 'image' | 'price'>;

export type TCardItemCompact = Pick<IProduct, 'title' | 'price'>;

export type CatalogChangeEvent = IProduct[];

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export enum Events {
    CATALOG_UPDATE = 'catalog:update',
    CARD_SELECT = 'card:select',
    CART_UPDATE = 'cart:update',
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
    CART_OPEN = 'cart:open',
}
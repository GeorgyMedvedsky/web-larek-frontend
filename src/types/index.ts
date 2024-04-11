export interface IAppState {
    catalog: IProduct[];
    preview: IProduct | null;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null | string;
}

export interface IPage {
    catalog: HTMLElement[];
    wrapper: HTMLElement;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IModalData {
    content: HTMLElement;
}

export type TCardItem = Pick<IProduct, 'title' | 'category'| 'image' | 'price'>;

export type CatalogChangeEvent = IProduct[];

export enum Events {
    CATALOG_CHANGED = 'catalog:changed',
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
    CARD_SELECT = 'card:select',
    PREVIEW_CHANGED = 'preview:changed',
}

// export interface ICart {
//     items: IProduct [];
//     totalPrice: number;

//     addItem(item: IProduct):void;
//     removeItem(productId: Pick<IProduct, 'id'>):void;
//     getItems():IProduct [];
// }

// export interface IOrder {
//     payment: string;
//     adress: string;
//     email: string;
//     phone: number;
//     items: IProduct [];
//     price: number;
    
//     setOrder(data: IOrder):void;
//     getOrder(): IOrder;
// }
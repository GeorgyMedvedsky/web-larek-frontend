export interface ICatalog {
    data: IProduct[];
    selectedItem: IProduct;
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
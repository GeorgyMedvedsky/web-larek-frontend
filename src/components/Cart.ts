import { IProduct } from "./Product";

interface ICart {
    items: IProduct[];
    totalPrice: number;

    removeItem: (id: string) => IProduct[];
    clearAll: () => [];
    checkout: () => void;
}
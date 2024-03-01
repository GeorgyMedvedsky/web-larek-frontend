import { IProductUI } from "./ProductUI";

interface ICartUI {
    items: IProductUI[];
    totalPrice: number;

    removeItem: (id: string) => IProductUI[];
    clearAll: () => [];
    checkout: () => void;
}
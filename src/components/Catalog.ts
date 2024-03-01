import { IProduct } from "./Product";

interface ICatalog {
    items: IProduct[];

    getItems: () => IProduct[];
}
import { IProductUI } from "./ProductUI"

interface ICatalogUI {
    items: IProductUI[]

    showItem: (id: string) => IProductUI;
}
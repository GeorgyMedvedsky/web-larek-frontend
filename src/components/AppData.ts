import { Model } from "./base/Model";
import { IAppState, IProduct } from "../types";
import { Events } from "../types";

export class ProductItem extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null | string;
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    preview: IProduct | null;

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges(Events.CATALOG_CHANGED, { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.emitChanges(Events.PREVIEW_CHANGED, item);
    }
}
import { Model } from "./base/Model";
import { IAppState, IProduct } from "../types";
import { Events } from "../types";
import { IEvents } from "./base/events";

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
    cart: {
        items: IProduct[];
        totalPrice: string | number;
    };

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.cart = {
            items: [],
            totalPrice: 0
        };
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges(Events.CATALOG_CHANGED, { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.emitChanges(Events.PREVIEW_CHANGED, item);
    }

    addCartItem(item: IProduct) {
        this.cart.items = [
            ...this.cart.items,
            item
        ];
    }

    removeCartItem(id: string) {
        this.cart.items = this.cart.items.filter(item => item.id !== id);
    }

    setTotalPrice(items: IProduct[]) {
        this.cart.totalPrice = items.reduce((acc, curr) => acc + Number(curr.price), 0);
    }

    // clearCart() {
    //     this.cart.items = [];
    //     this.emitChanges(Events.CART_CHANGED, []);
    // }
}
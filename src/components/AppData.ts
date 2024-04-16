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
    price: number | null;
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    cart: {
        items: IProduct[];
        totalPrice: number;
    };

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.cart = {
            items: [],
            totalPrice: 0
        };
    }

    setCatalog(items: IProduct[]):void {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges(Events.CATALOG_UPDATE, { catalog: this.catalog });
    }

    isAddedToCart(item: IProduct):boolean {
        return this.cart.items.includes(item);
    }

    addCartItem(item: IProduct):void {
        this.cart.items = [
            ...this.cart.items,
            item
        ];
    }

    removeCartItem(id: string):void {
        this.cart.items = this.cart.items.filter(item => item.id !== id);
    }

    setTotalPrice(items: IProduct[]):void {
        this.cart.totalPrice = items.reduce((acc, curr) => acc + Number(curr.price), 0);
    }

    clearCart():void {
        this.cart.items = [];
    }
}
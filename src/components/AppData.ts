import { Model } from "./base/Model";
import { IProduct } from "../types";
import { Events } from "../types";
import { IEvents } from "./base/Events";

interface IAppState {
    catalog: IProduct[];
    cart: {
        items: IProduct[];
        totalPrice: number;
    };
    order: IOrderForm;
}

interface IOrderForm {
    payment: string; 
    email: string; 
    phone: string; 
    address: string;
}

interface IOrder extends IOrderForm {
    total: number; 
    items: string[]; 
}

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
    order: IOrder;

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);

        this.cart = {
            items: [],
            totalPrice: 0
        };

        this.order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        }
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
import { Model } from "./base/Model";
import { Events, IProduct, IOrderForm, IOrder, FormErrors } from "../types";
import { IEvents } from "./base/Events";

interface IAppState {
    catalog: IProduct[];
    cart: {
        items: IProduct[];
        totalPrice: number;
    };
    order: IOrderForm;
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
    formErrors: FormErrors = {};

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
        this.cart = {
            items: [],
            totalPrice: 0
        };
    }

    clearOrder():void {
        this.order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        }
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit(Events.FORM_ERRORS_CHANGE, this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
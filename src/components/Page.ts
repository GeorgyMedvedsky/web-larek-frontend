import { View } from "./base/View";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { Events, IPage } from "../types";

export class Page extends View<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _cart: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._cart = ensureElement<HTMLElement>('.header__basket');

        this._cart.addEventListener('click', () => {
            this.events.emit(Events.CART_OPEN);
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
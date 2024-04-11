import { View } from "./base/View";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types";

export class Page extends View<IPage> {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
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
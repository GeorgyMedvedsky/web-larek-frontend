import { View } from '../base/View';
import { ICartView, Events } from '../../types/index';
import { EventEmitter } from '../base/events';
import { createElement, ensureElement, formatNumber} from "../../utils/utils";
import { formTemplates } from '../../utils/constants';

export class Cart extends View<ICartView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _itemIndex: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        this.setDisabled(this._button, true);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit(Events.FORM_OPEN, formTemplates.order);
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            items.forEach((item, index) => {
                this._itemIndex = item.querySelector('.basket__item-index');
                this.setText(this._itemIndex, index + 1);
            });
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }
}
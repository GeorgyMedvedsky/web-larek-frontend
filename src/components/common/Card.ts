import { View } from "../base/View";
import { ensureElement } from "../../utils/utils";
import { ICardActions, IProduct, TCardItem, TCardItemCompact } from "../../types";

export class Card<T> extends View<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string) {
        this.setText(this._price, value);
    }
}

export class CardItem extends Card<TCardItem> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);

        this._image = ensureElement<HTMLImageElement>(`.${this.blockName}__image`, container);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._category = ensureElement<HTMLElement>(`.${this.blockName}__category`, container);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
        switch(value) {
            case 'софт-скил': {
                this.toggleClass(this._category, 'card__category_soft', true);
                break;
            }
            case 'хард-скил': {
                this.toggleClass(this._category, 'card__category_hard', true);
                break;
            }
            case 'дополнительное': {
                this.toggleClass(this._category, 'card__category_additional', true);
                break;
            }
            case 'кнопка': {
                this.toggleClass(this._category, 'card__category_button', true);
                break;
            }
            default: this.toggleClass(this._category, 'card__category_other', true);
        }
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}

export class CardItemCompact extends Card<TCardItemCompact> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}
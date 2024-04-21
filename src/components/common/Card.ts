import { View } from "../base/View";
import { ensureElement, formatNumber } from "../../utils/utils";
import { IProduct, TCardItem } from "../../types";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

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

    set price(value: number | null) {
        value === null
            ? this.setText(this._price, 'Бесценно')
            : this.setText(this._price, `${formatNumber(value)} синапсов`);
    }

    set button(value: string | HTMLElement) {
        this.setText(this._button, value);
    }

    get button(): HTMLElement {
        return this._button;
    }
}

interface CategorySettings {
    names: CategorySettingsNames;
    classes: CategorySettingsClasses;
}

type CategorySettingsNames = {
    soft: string;
    hard: string;
    additional: string;
    button: string;
    other: string;
};

type CategorySettingsClasses = {
    soft: string;
    hard: string;
    additional: string;
    button: string;
    other: string;
};

export class CardItem extends Card<TCardItem> {
    protected _categorySettings: CategorySettings;

    constructor(container: HTMLElement, categorySettings: CategorySettings, actions?: ICardActions) {
        super('card', container, actions);

        this._image = ensureElement<HTMLImageElement>(`.${this.blockName}__image`, container);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._category = ensureElement<HTMLElement>(`.${this.blockName}__category`, container);
        this._categorySettings = categorySettings;
    }

    set image(value: string) { 
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
        switch(value) {
            case this._categorySettings.names.soft: {
                this.toggleClass(this._category, this._categorySettings.classes.soft, true);
                break;
            }
            case this._categorySettings.names.hard: {
                this.toggleClass(this._category, this._categorySettings.classes.hard, true);
                break;
            }
            case this._categorySettings.names.additional: {
                this.toggleClass(this._category, this._categorySettings.classes.additional, true);
                break;
            }
            case this._categorySettings.names.button: {
                this.toggleClass(this._category, this._categorySettings.classes.button, true);
                break;
            }
            default: this.toggleClass(this._category, this._categorySettings.classes.other, true);
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
import { Events, IOrderForm } from '../../types';
import { View } from '../base/View';
import { IEvents } from '../base/Events';
import { ensureAllElements, ensureElement } from '../../utils/utils';

interface IFormState {
    valid: boolean;
    errors: string[];
}

class Form<T> extends View<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _inputList: HTMLInputElement[];
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit(Events.FORM_SUBMIT, this.container.name);
            this.container.reset();
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(Events.INPUT_CHANGE, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

export class OrderForm extends Form<IOrderForm> {
    protected _radioButtons: HTMLButtonElement[];
    protected _defaultButton: HTMLButtonElement;
    public payment: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._radioButtons = ensureAllElements('.button_alt', this.container);
        this._defaultButton = this._radioButtons.find(btn => btn.value === 'Онлайн');

        this.payment = this._defaultButton;
        this.togglePaymentButtons(this.payment, this._radioButtons);

        this._radioButtons.forEach(button => {
            button.addEventListener('click', (evt: Event) => {
                this.payment = evt.target as HTMLButtonElement;
                this.togglePaymentButtons(evt.target as HTMLButtonElement, this._radioButtons);
            });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.payment = this._defaultButton
            this.togglePaymentButtons(this.payment, this._radioButtons);
        });
    }

    togglePaymentButtons(button: HTMLButtonElement, buttons: HTMLButtonElement[]) {
        this.toggleClass(button, 'button_alt-active', true);
        buttons.forEach(btn => {
            if(btn !== button) {
                this.toggleClass(btn, 'button_alt-active', false);
            }
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class ContactsForm extends Form<IOrderForm> {
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
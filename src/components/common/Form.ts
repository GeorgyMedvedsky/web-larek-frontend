import { Events } from '../../types';
import { View } from '../base/View';
import { IEvents } from '../base/Events';
import { ensureAllElements } from '../../utils/utils';

interface IFormState {
    radioButtons: HTMLButtonElement[];
    payment: HTMLButtonElement;
    address: HTMLInputElement;
    phone: HTMLInputElement;
    email: HTMLInputElement;
}

export class Form extends View<IFormState> {
    public radioButtons: HTMLButtonElement[];
    public payment: HTMLButtonElement;
    public address: HTMLInputElement;
    public phone: HTMLInputElement;
    public email: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.radioButtons = ensureAllElements('.button_alt', this.container);
        this.address = (this.container.elements.namedItem('address') as HTMLInputElement);
        this.phone = (this.container.elements.namedItem('phone') as HTMLInputElement);
        this.email = (this.container.elements.namedItem('email') as HTMLInputElement);
        
        this.radioButtons.forEach(button => {
            button.addEventListener('click', (evt: Event) => {
                this.toggleClass(evt.target as HTMLButtonElement, 'button_alt-active', true);
                this.payment = evt.target as HTMLButtonElement;
                this.radioButtons.forEach(btn => {
                    if(btn !== evt.target) {
                        this.toggleClass(btn, 'button_alt-active', false);
                    }
                });
            });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit(Events.FORM_SUBMIT, this.container.name);
        });
    }
}
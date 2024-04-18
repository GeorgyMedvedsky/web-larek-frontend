import { Events } from '../../types';
import { formNames, formTemplates } from '../../utils/constants';
import { View } from '../base/View';
import { IEvents } from '../base/events';

interface IFormState {
    
}

export class Form extends View<IFormState> {

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if(this.container.name === formNames.ORDER) {
                events.emit(Events.FORM_SUBMIT, formTemplates.contacts);
            } else if(this.container.name === formNames.CONTACTS) {
                events.emit(Events.ORDER_SUMBIT);
            }
        });
    }
}
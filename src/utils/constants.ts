import { ensureElement } from "./utils";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const categorySettings = {
    names: {
        soft: 'софт-скил',
        hard: 'хард-скил',
        additional: 'дополнительное',
        button: 'кнопка',
        other: 'другое'
    },
    classes: {
        soft: 'card__category_soft',
        hard: 'card__category_hard',
        additional: 'card__category_additional',
        button: 'card__category_button',
        other: 'card__category_other'
    }
};

export const formNames = {
    ORDER: 'order',
    CONTACTS: 'contacts'
};

export const formTemplates = {
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts')
};
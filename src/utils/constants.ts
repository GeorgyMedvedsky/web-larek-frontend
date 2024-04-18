import { ensureElement } from "./utils";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const formNames = {
    ORDER: 'order',
    CONTACTS: 'contacts'
};

export const formTemplates = {
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts')
};
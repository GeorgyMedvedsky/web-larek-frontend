interface IFormUI {
    adress: string;
    email: string;
    phone: number;
    payment: string;
    totalPrice: number;
    items: string [];

    submit: () => void;
}
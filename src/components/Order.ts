interface IOrder {
    adress: string;
    email: string;
    phone: number;
    payment: string;
    totalPrice: number;
    items: string [];

    setData: () => void;
}
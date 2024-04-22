import { IProduct, ApiListResponse, IOrder } from "../types";
import { Api } from "./base/Api";

interface IOrderResult {
    id: string;
}

export class LarekApi extends Api {
    cdn:string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList():Promise<IProduct[]> {
        return this.get(`/product`)
            .then((data: ApiListResponse<IProduct>) => 
                data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image
            }))
        );
    }

    postOrder(order: IOrder):Promise<IOrderResult> {
        return this.post('/order', order)
            .then((data: IOrderResult) => data)
    }
}
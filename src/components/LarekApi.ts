import { IProduct, ApiListResponse } from "../types";
import { Api } from "./base/Api";

export interface ILarekApi {
    getProductItem: (id: string) => Promise<IProduct>;
    getProductList: () => Promise<IProduct[]>;
}

export class LarekApi extends Api {
    cdn:string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
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
}
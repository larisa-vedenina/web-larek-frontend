import { Api, ApiListResponse } from './base/api';
import { IProductCard, TFullOrderData, IOrderResponse } from '../types/index';

export interface IAuctionAPI {
    getProductCards: () => Promise<IProductCard[]>;
    placeOrder(order: TFullOrderData): Promise<IOrderResponse>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // Метод для получения списка товаров

    getProductCards(): Promise<IProductCard[]> {
        return this.get('/product/').then((data: ApiListResponse<IProductCard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    async placeOrder(order: TFullOrderData): Promise<IOrderResponse> {
        // Выполняем POST-запрос к API для оформления заказа
        const data = await this.post('/order', order);
        return data as IOrderResponse;
    }
}
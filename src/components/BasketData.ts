import { IBasketData, IProductCard } from "../types";
import { IEvents } from "./base/events";



// Класс модели корзины
export class BasketData implements IBasketData {
    protected _items: IProductCard[] = [];

    constructor(protected events: IEvents) { }

    //  для получения списка товаров
    get items(): IProductCard[] {
        return this._items;
    }

    // для получения общей стоимости
    get total(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    // Получить список id товаров в корзине
    getProductIds(): string[] {
        return this._items.map((item) => item.id);
    }

    // Добавить товар в корзину
    addProduct(product: IProductCard): void {
        this._items.push(product);
        this.emitChange();
    }

    // Удалить товар из корзины
    removeProduct(productId: string): void {
        this._items = this._items.filter((item) => item.id !== productId);
        this.emitChange();
    }

    // Получить количество товаров в корзине
    getItemCount(): number {
        return this._items.length;
    }

    // Проверить товар в корзине
    hasProduct(productId: string): boolean {
        return this._items.some((item) => item.id === productId);
    }

    // Очистить корзину
    clearBasket(): void {
        this._items = [];
        this.emitChange();
    }

    private emitChange(): void {
        this.events.emit('basket:changed');
    }
}

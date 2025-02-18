import { IProductCard } from "./ProductApi";

// Интерфейс для модального окна (контент может быть одним элементом или массивом)
export interface IModalContent {
    elements: HTMLElement | HTMLElement[];
};


// Интерфейс для отображения данных корзины
export interface IBasketDisplay {
    items: HTMLElement[];
    total: number;
};


// Интерфейс для работы с корзиной
export interface IBasketManager {
    products: IProductCard[] | IProductCard;
    total: number;
    addProduct(product: IProductCard): void;
    removeProduct(id: string): void;
    getItemCount(): number;
    getTotal(): number;
    hasProduct(id: string): boolean;
    clearBasket(): void;
};

// Описание товара, которое мы будем хранить в корзине и в localStorage
export type BasketProductCard = {
    id: string;
    title: string;
    price: number;
};


// Интерфейс состояния формы с валидностью и сообщениями об ошибках
export interface IFormValidationState {
    isValid: boolean;
    errorMessages: string[];
}


// Тип для ошибок валидации отдельных полей формы
export type TOrderFieldErrors = {
    email?: string;
    phone?: string;
    address?: string;
    payment?: string;
};


// Общий интерфейс ответа API
export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
  };
  
  // Описание карточки товара
  export interface IProductCard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
  
  // Интерфейс для работы с коллекцией карточек товаров
  export interface IProductCardsData {
    items: IProductCard[];
    findCardById(cardId: string): IProductCard;
  }
  
  // Интерфейс для данных оплаты заказа
  export interface IPaymentData {
    payment: string;
    address: string;
  }
  
  // Интерфейс контактной информации
  export interface IContactData {
    email: string;
    phone: string;
  }
  
  // Итоговые данные заказа, отправляемые на сервер
  export interface IOrderSummary extends IPaymentData, IContactData {
    id: string[];
    total: number;
  }
  
  // Интерфейс результата заказа, получаемого с сервера
  export interface IOrderResponse {
    id: string;
    total: number;
  }
  
  // Полные данные для оформления заказа
  export type TFullOrderData = IPaymentData & IContactData;
  
  
  // Интерфейс для отображения данных корзины
  export interface IBasketDisplay {
    items: HTMLElement[];
    total: number;
  }
  
  // Интерфейс для работы с корзиной
  export interface IBasketData {
    items: IProductCard[];
    addProduct(product: IProductCard): void;
    removeProduct(id: string): void;
    getItemCount(): number;
    getTotal(): number;
    hasProduct(id: string): boolean;
    clearBasket(): void;
  }
  
  // Описание товара, которое мы будем хранить в корзине
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
  export type TFormErrors = Partial<Record<keyof TFullOrderData, string>>;
  
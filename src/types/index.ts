
  // Описание карточки товара
  export interface IProductCard {
    id: string;
    title: string;
    description: string;
    image: string;
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

  // Интерфейс для работы с данными заказа
  export interface IOrderData {
    setOrderField(field: keyof TFullOrderData, value: string): void; // Установить значение поля
    updatePaymentMethod(method: string): void; // Обновить способ оплаты
    validateOrder(): boolean; // Валидировать 
    clearOrder(): void; // Очистить данные 
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
  
  
  // Интерфейс для работы с корзиной
  export interface IBasketData {
    items: IProductCard[];
    total: number;
    addProduct(product: IProductCard): void;
    removeProduct(id: string): void;
    getItemCount(): number;
    hasProduct(id: string): boolean;
    clearBasket(): void;
  }

  // Интерфейс для отображения данных корзины
export interface IBasketDisplay {
  items: HTMLElement[];
  total: number;
}
  
  
  // Тип для ошибок валидации отдельных полей формы
  export type TFormErrors = Partial<Record<keyof TFullOrderData, string>>;
  

  export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
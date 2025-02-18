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
  price: number;
};


// Интерфейс для работы с коллекцией карточек
export interface IProductCatalog {
  items: IProductCard[];
  findCardById(cardId: string): IProductCard;
};



// Интерфейс для данных оплаты заказа
export interface IPaymentDetails {
  method: string;
  address: string;
};


// Интерфейс контактной информации
export interface IContactInfo {
  email: string;
  phone: string;
};


// Итоговые данные заказа, отправляемые на сервер
export interface IOrderSummary {
  email: string;
  phone: string;
  address: string;
  payment: string;
  id: string[];
  total: number;
}


// Интерфейс результата заказа, получаемого с сервера
export interface IOrderResponse {
  id: string;
  total: number;
}

// Полные данные для оформления заказа
export interface IFullOrderData {
  email: string;
  phone: string;
  address: string;
  payment: string;
}
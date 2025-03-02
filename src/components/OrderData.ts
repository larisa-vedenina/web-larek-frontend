import { IOrderData, TFormErrors, TFullOrderData } from "../types";
import { IEvents } from "./base/events";



// Класс модели для работы с данными заказа
export class OrderData implements IOrderData {
  protected order: TFullOrderData = {
    email: '',
    phone: '',
    payment: '',
    address: '',
  };

  protected formErrors: TFormErrors = {}; // Ошибки валидации

  constructor(protected events: IEvents) { }


  // Геттер для доступа к order
  get orderData(): TFullOrderData {
    return this.order;
  }

  // Геттер для доступа к formErrors
  get errors(): Partial<Record<keyof TFullOrderData, string>> {
    return this.formErrors;
  }

  // Установить значение поля заказа

  setOrderField(field: keyof TFullOrderData, value: string): void {
    this.order[field] = value;
    this.validateOrder();
    this.events.emit('order:change', this.order);
  }

  // Обновить способ оплаты
  updatePaymentMethod(method: string): void {
    this.order.payment = method;
    this.validateOrder();
    this.events.emit('order:change', this.order);
  }

  // Валидировать заказа
  validateOrder(): boolean {
    const errors: TFormErrors = {};

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit('order:errors', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Очистить данные заказа
  clearOrder(): void {
    this.order = {
      email: '',
      phone: '',
      address: '',
      payment: '',
    };
    this.events.emit('order:change', this.order);
  }
}


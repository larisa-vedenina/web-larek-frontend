import { IPaymentData } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./form";


// Класс для отображения формы оплаты
export class OrderPaymentForm extends Form<IPaymentData> {
    protected paymentButtons: HTMLButtonElement[]; // Кнопки выбора способа оплаты
    protected cardPaymentButton: HTMLButtonElement; // Кнопка "онлайн"
    protected cashPaymentButton: HTMLButtonElement; // Кнопка "при получении"
    protected nextButton: HTMLButtonElement; // Кнопка "Далее"
  
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
  
      // Находим элементы в DOM
      this.paymentButtons = ensureAllElements('button[type=button]', this.container);
      this.cardPaymentButton = ensureElement<HTMLButtonElement>("button[name=card]", this.container);
      this.cashPaymentButton = ensureElement<HTMLButtonElement>("button[name=cash]", this.container);
      this.nextButton = ensureElement(".order__button", this.container) as HTMLButtonElement;
  
      // Добавляем обработчики для кнопок выбора способа оплаты
      this.paymentButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
          const target = event.target as HTMLButtonElement;
  
          // Обновляем состояние кнопок
          this.cardPaymentButton.classList.toggle("button_alt-active", target === this.cardPaymentButton);
          this.cashPaymentButton.classList.toggle("button_alt-active", target === this.cashPaymentButton);
  
          // Уведомляем об изменении способа оплаты
          this.events.emit('payment:change', { field: 'payment', value: target.innerText });
        });
      });
    }
    
    // Устанавливаем состояние кнопки "Далее"
    set disabled(isValid: boolean) {
      console.log(`Setting valid to ${isValid}`); // Отладочный вывод
      this.nextButton.classList.toggle('popup__button_disabled', !isValid);
      this.nextButton.disabled = !isValid;
    };
  
    // Устанавливаем значение адреса
    set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
  
    // Устанавливаем значение телефона
    set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
  
    // Устанавливаем значение email
    set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
  
    // Получаем форму
    get form(): HTMLFormElement {
      return this.container;
    }
  
    // Сбрасываем выбранный способ оплаты
    resetPaymentMethod(): void {
      this.cardPaymentButton.classList.remove("button_alt-active");
      this.cashPaymentButton.classList.remove("button_alt-active");
    }
  }

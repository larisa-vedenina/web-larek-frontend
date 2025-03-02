import { IContactData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./form";

  
  // Класс для работы с формой контактной информации
  export class ContactForm extends Form<IContactData> {
    protected nextButton: HTMLButtonElement; // Кнопка "Оплатить"
  
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
  
      // Находим кнопку "Оплатить" в DOM
      this.nextButton = ensureElement<HTMLButtonElement>(".button", this.container);

      // Добавляем обработчик клика на кнопку "Оплатить"
    this.nextButton.addEventListener('click', (e) => {
      e.preventDefault(); 
      this.events.emit('contacts:submit');
    });
  }
  
    // Получаем форму
    get form(): HTMLFormElement {
      return this.container;
    }
  
    // Устанавливаем состояние кнопки "Оплатить"
    set disabled(valid: boolean) {
        this.nextButton.disabled = !valid; 
    }
  }
  
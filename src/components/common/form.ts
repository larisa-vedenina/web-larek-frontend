import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

// Интерфейс для состояния формы
interface IFormState {
  valid: boolean;
  errors: string[];
}

// Базовый класс для работы с формой
export class Form<T> extends Component<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errorContainer: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    // Находим элементы в DOM
    this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    // Обработчик изменения полей формы
    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.handleInputChange(field, value);
    });


    // Обработчик отправки формы
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }


  // Обработчик изменения значения поля
  protected handleInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }


  // Устанавливаем текст ошибок
  set errors(value: string) {
    this.setText(this._errorContainer, value);
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
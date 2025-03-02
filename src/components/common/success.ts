import {Component} from "../base/component";
import {ensureElement} from "../../utils/utils";
import { IEvents } from "../base/events";
import { ICardActions } from "../../types";

interface ISuccess {
    totalSum: number; // Общая сумма заказа
  }
  

// Класс для отображения итоговой суммы
export class SuccessView extends Component<ISuccess> {
    protected totalElement: HTMLElement; 
    protected closeButton: HTMLButtonElement; 
  
    constructor(container: HTMLFormElement, events: IEvents, actions?: ICardActions) {
      super(container);
  
      // Находим элементы в DOM
      this.totalElement = ensureElement<HTMLElement>(".order-success__description", this.container);
      this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
  
      // Добавляем обработчик клика на кнопку закрытия
      if (actions?.onClick) {
        this.closeButton.addEventListener('click', actions.onClick);
      }
    }
  
    // Устанавливаем итоговую сумму
    set totalSum(value: number) {
      this.totalElement.innerText = `Списано ${value} синапсов`;
    }
  }
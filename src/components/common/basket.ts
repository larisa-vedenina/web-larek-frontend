import { Component } from "../base/component";
import { createElement, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IBasketDisplay } from "../../types";


// Класс для отображения корзины
export class BasketView extends Component<IBasketDisplay> {
    protected events: IEvents;
    protected _basketButton: HTMLButtonElement; // Кнопка корзины
    protected _totalPriceElement: HTMLElement; // общая стоимость
    protected _productList: HTMLElement; // Список товаров в корзине

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        // Находим элементы в дом
        this._basketButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
        this._totalPriceElement = ensureElement<HTMLElement>(".basket__price", this.container);
        this._productList = ensureElement<HTMLElement>(".basket__list", this.container);

        // обработчик клика на кнопку корзины
        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => {
              events.emit('order:open');
            });
          }

        this.items = [];
    }

    // Устанавливаем список товаров в корзине
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._productList.replaceChildren(...items);
            this._basketButton.removeAttribute("disabled");
        } else {
            this._basketButton.setAttribute("disabled", "disabled");
            this._productList.replaceChildren(
                createElement<HTMLParagraphElement>("p", {
                    textContent: "В корзине нет товаров",
                })
            );
        }
    }

    // Устанавливаем общую стоимость товаров в корзине
    set totalPrice(total: number) {
        this.setText(this._totalPriceElement, `${total} синапсов`);
    }


    render(data?: IBasketDisplay): HTMLElement {
        if (data) {
            // Очищаем и заполняем список товаров
            this._productList.innerHTML = '';
            data.items.forEach(item => this._productList.appendChild(item));

            // Устанавливаем общую стоимость
            this.totalPrice = data.total;

            // Обновляем состояние кнопки корзины
            this._basketButton.disabled = data.items.length === 0;
        }
        return this.container;
    }
}
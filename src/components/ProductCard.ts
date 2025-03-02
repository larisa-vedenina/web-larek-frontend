import { ICardActions, IProductCard } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";



export interface ICardsContainer {
    catalog: HTMLElement[] | HTMLElement;
}


// Базовый класс для отображения карточки товара
export class ProductCard extends Component<IProductCard> {
    protected cardId: string; // Уникальный ID карточки
    protected _title: HTMLElement; // отображение названия
    protected _image?: HTMLImageElement; // отображенияе изображения
    protected _category?: HTMLElement; // отображение категории
    protected _price: HTMLElement; // отображение цены
    protected button?: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
        super(container);
        this.events = events;

        // Находим элементы в DOM
        this._title = this.container.querySelector(".card__title");
        this._image = this.container.querySelector(".card__image");
        this._category = this.container.querySelector(".card__category");
        this._price = this.container.querySelector(".card__price");
        this.button = this.container.firstElementChild?.querySelector(".gallery__item");

        // Если есть обработчик клика, добавляем его
        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener("click", actions.onClick);
            } else {
                container.addEventListener("click", actions.onClick);
            }
        }
    }

    // Устанавливаем ID карточки
    set id(id: string) {
        this.cardId = id;
    }

    // Получаем ID карточки
    get id(): string {
        return this.cardId;
    }

    // Устанавливаем название карточки
    set title(value: string) {
        this.setText(this._title, value);
    }

    // Устанавливаем цену карточки
    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, "Бесценно");
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    // Устанавливаем категорию карточки
    set category(value: string) {
        this.setText(this._category, value);

        // Меняем цвет фона в зависимости от категории
        switch (value) {
            case "софт-скил":
                this._category.style.background = "#83FA9D";
                break;
            case "другое":
                this._category.style.background = "#FAD883";
                break;
            case "дополнительное":
                this._category.style.background = "#B783FA";
                break;
            case "кнопка":
                this._category.style.background = "#83DDFA";
                break;
            case "хард-скил":
                this._category.style.background = "#FAA083";
                break;
        }
    }

    // Устанавливаем изображение карточки
    set image(link: string) {
        this.setImage(this._image, link);
    }
}


// Класс для отображения карточки в модальном окне 
export class ModalCardPreview extends ProductCard {
    protected _description: HTMLElement; // отображение описания
    protected buyButton: HTMLButtonElement; // Кнопка "Купить"

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
        super(container, events);

        // Находим элементы в DOM
        this._description = ensureElement(".card__text", this.container);
        this.buyButton = ensureElement(".card__button", this.container) as HTMLButtonElement;

        // Если есть обработчик клика, добавляем его
        if (actions?.onClick) {
            this.buyButton.addEventListener("click", actions.onClick);
        }
    }

    // Геттер для доступа к кнопке "Купить"
    get buyButtonElement(): HTMLButtonElement {
        return this.buyButton;
    }

    // Устанавливаем описание карточки
    set description(description: string) {
        this.setText(this._description, description);
    }

    // Блокируем или разблокируем кнопку "Купить" 
    setDisabled(button: HTMLButtonElement, isDisabled: boolean) {
        button.disabled = isDisabled;
    }

    // Меняем текст кнопки "Купить" в зависимости от состояния
    replaceButtonText(isInCart: boolean) {
        const buttonText = isInCart ? "Удалить из корзины" : "В корзину";
        this.setText(this.buyButton, buttonText);
    }
}



// Класс для отображения карточки в корзине
export class ModalCardBasket extends ProductCard {
    protected _basketIndex: HTMLElement; //отображение индекса в корзине
    protected basketIndexDelete: HTMLButtonElement; // Кнопка "Удалить"

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
        super(container, events);

        // Находим элементы в DOM
        this._basketIndex = this.container.querySelector(".basket__item-index");
        this.basketIndexDelete = this.container.querySelector(".basket__item-delete") as HTMLButtonElement;

        // Если есть обработчик клика, добавляем его
        if (actions?.onClick) {
            this.basketIndexDelete.addEventListener("click", actions.onClick);
        }
    }

    // Устанавливаем индекс карточки в корзине
    set basketIndex(index: number) {
        this.setText(this._basketIndex, (index + 1).toString());
    }
}





// Класс для контейнера карточек
export class CardsContainer {
    protected _catalog: HTMLElement[]; 
    container: HTMLElement; 

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Сеттер для обновления каталога карточек
    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items); 
    }

    // Метод для рендеринга контейнера
    render(data: Partial<ICardsContainer>) {
        Object.assign(this, data); 
        return this.container; 
    }
}
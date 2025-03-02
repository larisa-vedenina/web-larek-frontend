import { Component } from "../base/component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IModalData {
    content: HTMLElement | HTMLElement[];
};


export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Находим элементы в DOM
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавляем обработчики событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());

        // Закрытие по клику вне контента
        this.container.addEventListener("mousedown", (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });

        // Закрытие по Esc
        this.handleEscUp = this.handleEscUp.bind(this);
        document.addEventListener("keyup", this.handleEscUp);
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
        document.addEventListener("keyup", this.handleEscUp);
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren(); // Очищаем контент
        this.events.emit('modal:close');
        document.removeEventListener("keyup", this.handleEscUp);
    }

    // Закрыть модальное окно по кнопке Esc
    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.close();
        }
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
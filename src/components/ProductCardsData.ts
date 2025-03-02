import { IProductCard, IProductCardsData } from "../types/index";
import { IEvents } from "./base/events";

// Класс, который реализует интерфейс IProductCardsData

export class ProductCardsData implements IProductCardsData {
    protected _items: IProductCard[]; // Список карточек товаров
    protected events: IEvents; // Объект для работы с событиями

    constructor(events: IEvents) {
        this.events = events;
        this._items = []; // Инициализируем пустой массив карточек
    }

    // Сеттер для обновления списка карточек
    set items(items: IProductCard[]) {
        this._items = items;
    }

    // Геттер для получения списка карточек
    get items(): IProductCard[] {
        return this._items;
    }

    // Метод для поиска карточки по ID
    findCardById(cardId: string): IProductCard {
        const foundCard = this._items.find((item) => item.id === cardId);

        // Если карточка не найдена, выбрасываем ошибку
        if (!foundCard) {
            throw new Error(`Карточка с ID ${cardId} не найдена!`);
        }

        return foundCard;
    }
}
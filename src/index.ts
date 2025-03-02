import { AuctionAPI } from './components/AuctionAPI';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { CardsContainer, ModalCardBasket, ModalCardPreview, ProductCard } from './components/ProductCard';
import { ProductCardsData } from './components/ProductCardsData';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/common/basket';
import { ContactForm } from './components/common/contact';
import { Modal } from './components/common/modal';
import { OrderPaymentForm } from './components/common/order';
import { SuccessView } from './components/common/success';
import { Page } from './components/page';
import './scss/styles.scss';
import { IProductCard, TFullOrderData } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


// EventEmitter для управления событиями
const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
    console.log(event.eventName, event.data);
});


// Все шаблоны
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modalContent = ensureElement<HTMLDivElement>('.modal__content');


// Контейнеры
const pageContainer = ensureElement<HTMLElement>('.page');
const page = new Page(pageContainer, events);
const modal = new Modal(modalContainer, events);


// Все экземпляры
const cardContainer = new CardsContainer(document.querySelector(".gallery"));
const productСardData = new ProductCardsData(events);

const basketData = new BasketData(events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);

const orderData = new OrderData(events);
const orderPaymentForm = new OrderPaymentForm(cloneTemplate(orderTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);


// Получаем список товаров с сервера
api.getProductCards()
    .then((data) => {
        productСardData.items = data;

        // Рендерим карточки товаров
        const renderedCards = productСardData.items.map((item) => {
            const card = new ProductCard(cloneTemplate(catalogCardTemplate), events, {
                onClick: () => events.emit('card:select', item),
            });

            return card.render({
                id: item.id,
                title: item.title,
                image: item.image,
                category: item.category,
                price: item.price,
            });
        });

        cardContainer.render({ catalog: renderedCards });
    })
    .catch((err) => {
        console.error(err);
    });



// Открыть модальное окно с карточкой товара
events.on('card:select', (item: IProductCard) => {
    const previewCard = new ModalCardPreview(cloneTemplate(previewCardTemplate), events, {
        onClick: () => {
            const selectedCard = productСardData.findCardById(item.id);

            if (basketData.hasProduct(item.id)) {
                basketData.removeProduct(item.id); // Удаляем товар 
                previewCard.replaceButtonText(false); // Обновляем текст кнопки
            } else {
                basketData.addProduct(selectedCard); // Добавляем товар 
                previewCard.replaceButtonText(true); // Обновляем текст кнопки
            }
        },
    });

    // Устанавливаем начальное состояние кнопки
    previewCard.replaceButtonText(basketData.hasProduct(item.id));

    // Отображаем модальное окно
    modal.render({
        content: previewCard.render(item),
    });

    // Блокируем кнопку, если товар недоступен
    previewCard.setDisabled(previewCard.buyButtonElement, item.price === null);
});



// Обработчик изменения корзины
events.on('basket:changed', () => {
    const basketItems = basketData.items.map((card, index) => {
        // Создаем карточку товара для корзины
        const basketCard = new ModalCardBasket(cloneTemplate(basketCardTemplate), events, {
            onClick: () => events.emit('basket:remove', card),
        });

        basketCard.basketIndex = index;

        return basketCard.render({
            id: card.id,
            title: card.title,
            price: card.price,
        });
    });

    // Обновляем отображение корзины
    basketView.render({
        items: basketItems,
        total: basketData.total,
    });

    // Обновляем счетчик товаров в корзине
    page.render({
        counter: basketData.getItemCount(),
    });
});

// Обработчик открытия корзины
events.on('basket:open', () => {
    modal.render({
        content: basketView.render(),
    });
});

// Обработчик удаления товара из корзины
events.on('basket:remove', (item: IProductCard) => {
    basketData.removeProduct(item.id);
});




// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
    page.locked = false;
});



// Оформление заказа

// Изменения в данных заказа
events.on('order:errors', (errors: Partial<TFullOrderData>) => {

    // Объединяем все ошибки в один массив
    const allErrors = Object.values(errors).filter(Boolean);

    // Обновляем состояние формы оплаты
    const { payment, address } = errors;
    orderPaymentForm.disabled = !payment && !address;
    orderPaymentForm.errors = Object.values({ payment, address }).filter(i => !!i).join(' и ');

    // Обновляем состояние формы контактов
    const { email, phone } = errors;
    contactForm.disabled = !email && !phone;; 
    contactForm.errors = Object.values({ email, phone }).filter(i => !!i).join(' и ');

    // Если есть ошибки, блокируем кнопку "Далее"
    orderPaymentForm.disabled = allErrors.length > 0;
});

// Изменение метода оплаты
events.on('payment:change', ({ value }: { value: string }) => {
    orderData.updatePaymentMethod(value);
});

// Изменение полей заказа
events.on(/^order\..*:change/, (data: { field: keyof TFullOrderData, value: string }) => {
    orderData.setOrderField(data.field, data.value);
});



// Открыть модальное окно оплаты
events.on('order:open', () => {

    modal.render({
        content: orderPaymentForm.render({
            payment: orderData.orderData.payment,
            address: orderData.orderData.address,
            valid: true,
            errors: [],
        }),
    });
});



// Открыть модальное окно контактов
events.on('order:submit', () => {
    console.log('order:submit event triggered');

    modal.render({
        content: contactForm.render({
            email: orderData.orderData.email,
            phone: orderData.orderData.phone,
            valid: true,
            errors: [],
        }),
    });
});



// Изменение полей контактов
events.on(/^contacts\..*:change/, (data: { field: keyof TFullOrderData, value: string }) => {
    orderData.setOrderField(data.field, data.value);
});


// Отправка заказа и отображение финального окна
events.on('contacts:submit', () => {

    const order = {
        payment: orderData.orderData.payment,
        address: orderData.orderData.address,
        email: orderData.orderData.email,
        phone: orderData.orderData.phone,
        total: basketData.total,
        items: basketData.getProductIds(),
    };

    api.placeOrder(order)
        .then(() => {
            const successView = new SuccessView(cloneTemplate(successTemplate), events, {
                onClick: () => {
                    modal.close();
                },
            });

            // Отображаем модальное окно с успешным завершением заказа
            modal.render({
                content: successView.render({
                    totalSum: basketData.total,
                }),
            });

            // Очистка корзины и данных заказа
            basketData.clearBasket();
            orderData.clearOrder();
            orderPaymentForm.form.reset();
            contactForm.form.reset();
            orderPaymentForm.resetPaymentMethod();
        })
        .catch((err) => {
            console.error(err);
        });
});
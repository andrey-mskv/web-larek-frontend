import './scss/styles.scss';
import { AppApi } from './components/AppAPI';
import { EventEmitter, IEvents } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketData } from './components/BasketData';
import { Item } from './components/Item';
import { ItemData } from './components/ItemsData';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { OrderData } from './components/OrderData';
import { MainPage } from './components/Page';
import { Success } from './components/Success';
import { IItem, IOrderForm, TOrderContact, TOrderInfo } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

// Брокер событий/слушатель событий
const events = new EventEmitter();
events.onAll((events) => {
	console.log(events.eventName, events.data);
});

// Модели данных
const itemData = new ItemData(events);
const orderData = new OrderData(events);
const basketData = new BasketData(events);

// Взаимодействие с сервером
const api = new AppApi(API_URL, CDN_URL);

// Контейнеры
const modal = new Modal(document.querySelector('#modal-container'), events);
const mainPage = new MainPage(document.body, events);

// Темплейты
const catalogItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const previewItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const orderItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-basket');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const preview = new Item(cloneTemplate(previewItemTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

api
	.getItems()
	.then((data) => {
		itemData.items = data;
		events.emit('items:changed', { data });
	})
	.catch((err) => {
		console.log('Ошибка загрузки данных:', err);
	});

// Рендер главной страницы
events.on('items:changed', () => {
	mainPage.gallery = itemData.items.map((item) => {
		const newItem = new Item(cloneTemplate(catalogItemTemplate), events);
		return newItem.render(item);
	});
	mainPage.counter = basketData.getCount();
});

events.on('item:select', (data: { id: string }) => {
	itemData.preview = data.id;
});

// Превью товара
events.on('preview:changed', (data: { id: string }) => {
	const item = itemData.getItem(data.id);
	modal.content = preview.render(item);
	preview.orderAble(basketData.items.some((item) => item.id === data.id));
	modal.open();
});

// Добавление товара в корзину
events.on('basket:add', (data: { item: IItem }) => {
	const { item } = data;
	const { id, title, price } = itemData.getItem(item.id);
	basketData.addToBasket({ id, title, price });
	events.emit('preview:changed', { id });
});

// Удаление товара из корзины
events.on('basket:delete', (data: { item: IItem }) => {
	basketData.deleteFromBasket(data.item);
	events.emit('basket:open');
});

events.on('basket:changed', () => {
	mainPage.counter = basketData.getCount();
});

events.on('basket:open', () => {
	modal.content = basket.render({
		items: basketData.items.map((item, index) => {
			const orderItem = new Item(cloneTemplate(orderItemTemplate), events);
			orderItem.setIndex(index + 1);
			return item ? orderItem.render(item) : null;
		}),
		total: basketData.getTotal(),
	});

	basket.activeBtn =
		basketData.total === 0 ||
		basketData.items.some((item) => item.price === null);

	modal.open();
});

events.on('order:select', () => {
	orderData.setOrederParams('payment', orderData.payment);
	order.payment = orderData.payment; // состояние кнопки способа оплаты
	order.errors = orderData.getErrorsValues();

	modal.content = order.render();
});

events.on('payment:select', (data: { name: string }) => {
	orderData.payment = data.name; // запись способа оплаты в модель
});

// Изменение одного из полей
events.on(
	/^order\..*\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
	orderData.setOrederParams(data.field, data.value);
	}
);

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address, email, phone } = errors;
	order.errors = Object.values({ payment, address, email, phone })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ payment, address, email, phone })
		.filter((i) => !!i)
		.join('; ');
	order.valid = orderData.getOrderValid();
	contacts.valid = orderData.getContactValid();
});

events.on('order:submit', () => {
	// contacts.errors = orderData.getErrorsValues();
	modal.content = contacts.render();
});

events.on('contacts:submit', () => {
	orderData.items = basketData.getItemsId();
	orderData.total = basketData.total;

	api
		.setOrder(orderData.order)
		.then((data) => {
			success.count = data.total;
			events.emit('total:receved', { data: data.total });
		})
		.catch((err) => {
			console.log('Ошибка загрузки данных:', err);
		});
});

events.on('total:receved', () => {
	orderData.cleanOrder();
	basketData.cleanBasket();
	mainPage.counter = basketData.getCount();
	modal.content = success.render();
});

events.on('success:close', () => {
	modal.close();
});

events.on('modal:open', () => {
	mainPage.locked = true;
});

events.on('modal:close', () => {
	mainPage.locked = false;
});

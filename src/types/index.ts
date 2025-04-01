export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export interface IBasketData {
	total: number;
	items: IItem[] | null;
}

export interface IItemsData {
	items: IItem[];
	preview: string | null;
	addItem(card: IItem): void;
	getItem(cardId: string): IItem;
}

export interface IOrderData {
	order: IOrder;
	formErrors: Partial<Record<keyof IOrder, string>>;
}

/**
 * Типы для карточек товаров public, preview, order
 */
export type TItemList = Pick<IItem, 'image' | 'title' | 'category' | 'price'>; // #card-catalog
export type TItemPreview = Pick<IItem, 'description'> & TItemList; // #card-preview
export type TItemOrder = Pick<IItem, 'title' | 'price'>; // #card-basket

/**
 * Типы для заказа
 */
export type TOrderInfo = Pick<IOrderForm, 'address' | 'payment'>;
export type TOrderContact = Pick<IOrderForm, 'email' | 'phone'>;
export type TOrderAnswer = { id: string; total: number };

export interface ILarekApi {
	getItems: () => Promise<IItem[]>;
	getItem: (id: string) => Promise<IItem>;
	setOrder: (oreder: IOrder) => Promise<TOrderAnswer>;
}

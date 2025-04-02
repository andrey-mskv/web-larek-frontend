import { IBasketData, IItem } from '../types';
import { EventEmitter } from './base/events';

export class BasketData implements IBasketData {
	protected _total = 0;
	protected _items: IItem[] = [];
	protected events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	getIds() {
		return this._items.map((item) => item.id);
	}

	getTotal(): string | number {
		if (this.isItemsPriceNull()) {
			return 'Мы не можем продать вам бесценный товар';
		} else {
			return this.calcTotal();
		}
	}

	// общая цена товаров
	protected calcTotal(): number {
		this._total = this._items.reduce((summ, item) => summ + item.price, 0);
		return this._total;
	}

	protected isItemsPriceNull(): boolean {
		const hasNullPrice = this._items.some((item) => item.price === null);
		return hasNullPrice;
	}

	get total() {
		return this._total;
	}

	set items(items: IItem[]) {
		this._items = items;
	}

	get items() {
		return this._items;
	}

	getCount(): number {
		return this._items.length;
	}

	private isItemInBasket(item: IItem): boolean {
		return this._items.some((exItem) => exItem.id === item.id);
	}

	addToBasket(item: Partial<IItem>): void {
		if (!this.isItemInBasket(item as IItem)) {
			this._items.push({ ...item } as IItem);
			this.events.emit('basket:change');
		}
	}

	deleteFromBasket(item: Partial<IItem>): void {
		this._items = this._items.filter((elem) => elem.id !== item.id);
		this.events.emit('basket:change');
	}

	cleanBasket(): void {
		this._items = [];
	}
}

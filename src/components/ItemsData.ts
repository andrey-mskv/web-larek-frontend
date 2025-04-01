import { IItem, IItemsData } from '../types';
import { EventEmitter } from './base/events';

export class ItemData implements IItemsData {
	protected events: EventEmitter;
	protected _items: IItem[];
	protected _preview: string;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	set items(items: IItem[]) {
		this._items = items;
	}

	get items() {
		return this._items;
	}

	set preview(id: string) {
		this._preview = id;
		this.events.emit('preview:changed', { id: id });
	}

	addItem(item: IItem): void {
		this._items = [item, ...this._items];
	}

	getItem(cardId: string) {
		return this._items.find((item) => item.id === cardId);
	}
}

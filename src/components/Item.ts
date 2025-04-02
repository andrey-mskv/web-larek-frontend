import { IItem } from '../types';
import { itemCategory } from '../utils/constants';
import { insertSpaces } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Item extends Component<IItem> {
	protected events: IEvents;
	protected itemImage: HTMLImageElement;
	protected itemTitle: HTMLElement;
	protected itemDescription: HTMLElement;
	protected itemPrice: HTMLElement;
	protected itemCategory: HTMLElement;
	protected itemOrderButton: HTMLButtonElement;
	protected itemDeleteButton: HTMLButtonElement;
	protected _id: string;
	protected itemIndex: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemImage = this.container.querySelector('.card__image');
		this.itemTitle = this.container.querySelector('.card__title');
		this.itemDescription = this.container.querySelector('.card__text');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemCategory = this.container.querySelector('.card__category');
		this.itemIndex = this.container.querySelector('.basket__item-index');

		this.itemDeleteButton = this.container.querySelector(
			'.basket__item-delete'
		);
		this.itemOrderButton = this.container.querySelector('.button');

		if (this.itemDeleteButton) {
			this.itemDeleteButton.addEventListener('click', () =>
				this.events.emit('basket:delete', { item: this })
			);
		}

		if (this.itemOrderButton) {
			this.itemOrderButton.addEventListener('click', () =>
				this.events.emit('basket:add', { item: this })
			);
		}

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () =>
				this.events.emit('item:select', { id: this.id })
			);
		}
	}

	set id(id: string) {
		this._id = id;
	}

	get id(): string {
		return this._id;
	}

	set title(value: string) {
		this.setText(this.itemTitle, value);
	}

	get title(): string {
		return this.itemTitle.textContent || '';
	}

	set description(value: string) {
		this.setText(this.itemDescription, value);
	}

	get description(): string {
		return this.itemDescription.textContent || '';
	}

	set category(value: string) {
		this.setText(this.itemCategory, value);
		if (this.itemCategory) {
			this.setCategoryColor(value);
		}
	}

	get category(): string {
		return this.itemCategory.textContent || '';
	}

	protected setCategoryColor(value: string) {
		const exCls = [...this.itemCategory.classList].find((clsName) =>
			clsName.startsWith('card__category_')
		);

		if (exCls) {
			this.itemCategory.classList.remove(exCls);
		}

		const cls = itemCategory[value] || '';
		if (cls) {
			this.itemCategory.classList.add(`card__category_${cls}`);
		}
	}

	set price(value: string | null) {
		if (value !== null) {
			const valueWithSpaces = insertSpaces(value.toString());
			this.setText(this.itemPrice, `${valueWithSpaces} синапсов`);
		} else {
			this.itemPrice.textContent = 'Бесценно';
		}
	}

	get price() {
		return this.itemPrice.textContent || '';
	}

	set image(value: string) {
		this.setImage(this.itemImage, value, this.title);
	}

	setIndex(value: number) {
		this.setText(this.itemIndex, value);
	}

	orderAble(status: boolean) {
		this.setDisabled(this.itemOrderButton, status);
	}
}

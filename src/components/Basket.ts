import { IOrder } from '../types';
import { createElement, insertSpaces } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasket {
	items: HTMLElement[] | null;
	total: string | number;
}

export class Basket extends Component<IBasket> {
	protected events: IEvents;
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._list = container.querySelector('.basket__list');
		this._button = container.querySelector('.basket__button');
		this._price = container.querySelector('.basket__price');

		this._button.addEventListener('click', () => {
			events.emit('order:select');
		});
	}

	get list(): HTMLElement {
		return this._list;
	}

	get price(): HTMLElement {
		return this._price;
	}

	set items(items: HTMLElement[] | null) {
		// console.log('длина', items.length)
		if (items.length > 0) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Тут пока ничего нет',
					className: 'basket__empty',
				})
			);
		}
	}

	set total(value: string | number) {
		if (typeof value === 'number') {
			if (value > 0) {
				const valueWithSpaces = insertSpaces(value.toString());
				this.setText(this._price, `${valueWithSpaces} синапсов`);
			} else {
				this.setText(this._price, '');
			}

		} else {
			this.setText(this._price, value);
		}
	}

	set activeBtn(isActive: boolean) {
		this.setDisabled(this._button, isActive);
	}
}

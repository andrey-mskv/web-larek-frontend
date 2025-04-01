import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export class MainPage extends Component<IPage> {
	protected events: IEvents;
	protected _wrapper: HTMLElement;
	protected _counter: HTMLElement;
	protected _basket: HTMLElement;
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._wrapper = container.querySelector('.page__wrapper');
		this._counter = container.querySelector('.header__basket-counter');
		this._basket = container.querySelector('.header__basket');
		this._gallery = container.querySelector('.gallery');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, value);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}

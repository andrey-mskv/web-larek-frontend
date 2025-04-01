import { Component } from './base/Component';
import { IEvents } from './base/events';
import { OrderData } from './OrderData';

// interface IModal {
// 	content: HTMLElement;
// }

export class Modal<T> extends Component<T> {
	// protected element: HTMLElement;
	protected events: IEvents;
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._closeButton = container.querySelector('.modal__close');
		this._content = container.querySelector('.modal__content');

		this._closeButton.addEventListener('click', () => this.close());

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});

		this.handleEscUp = this.handleEscUp.bind(this);
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	get content() {
		return this._content;
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEscUp);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null; // удалить дочерние элементы
		document.removeEventListener('keyup', this.handleEscUp);
		// OrderData.clearErrors();

		this.events.emit('modal:close');
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}

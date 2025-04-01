import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ISuccess {
	count: string;
}

export class Success extends Component<ISuccess> {
	protected events: IEvents;
	protected description: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.description = this.container.querySelector(
			'.order-success__description'
		);
		this.button = this.container.querySelector('.order-success__close');

		this.button.addEventListener('click', () => {
			this.events.emit('success:close');
		});
	}

	set count(value: number) {
		this.description.textContent = `Списано ${value.toString()} синапсов`;
	}
}

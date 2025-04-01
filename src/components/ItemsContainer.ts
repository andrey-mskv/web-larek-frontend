import { Component } from './base/Component';

interface IItemsContainer {
	gallery: HTMLElement[];
}

export class ItemsContainer extends Component<IItemsContainer> {
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
	}

	set gallery(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}

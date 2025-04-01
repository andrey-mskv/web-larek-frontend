import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error?: Record<string, string>;
	payment?: string;
}

export class Order<T> extends Component<IForm> {
	protected events: IEvents;

	// protected _form: HTMLFormElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected _errors: Record<string, HTMLElement>;
	protected label: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;

		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this.formName = this.container.getAttribute('name');
		this.submitButton = this.container.querySelector('button[type=submit]');
		this.paymentButtons = this.container.querySelectorAll(
			'button[type=button]'
		);
		this.label = this.container.querySelector('.order__field');

		this._errors = {};

		// для каждого инпута создается объект this.errors[имя инпута],
		// которому присваивается элемент с id = "[имя инпута]-error"

		this.inputs.forEach((input) => {
			this._errors[input.name] = this.container.querySelector(
				`#${this.formName}-errors`
			);
		});

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('payment:select', { name: button.name });
			});
		});

		this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order.${this.formName}.${String(field)}:change`, {
			field,
			value,
		});
	}

	getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	set valid(isValid: boolean) {
		this.setDisabled(this.submitButton, !isValid);
	}

	get name() {
		return this.formName;
	}

	set payment(name: string) {
		this.paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set errors(value: string) {
		this.setText(
			this.container.querySelector(`#${this.formName}-errors`),
			value
		);
	}
}

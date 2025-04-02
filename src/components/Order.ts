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

	protected _form: HTMLFormElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected inputs: NodeListOf<HTMLInputElement>;
	protected _errors: Record<string, HTMLElement>;
	protected label: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;
		this._form = container;

		this.inputs =
			this._form.querySelectorAll<HTMLInputElement>('.form__input');
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('button[type=submit]');
		this.paymentButtons = this._form.querySelectorAll(
			'button[type=button]'
		);
		this.label = this._form.querySelector('.order__field');

		this._errors = {};

		this.inputs.forEach((input) => {
			this._errors[input.name] = this._form.querySelector(
				`#${this.formName}-errors`
			);
		});

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('payment:select', { name: button.name });
			});
		});

		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order.${this.formName}.${String(field)}:change`, {
			field,
			value,
		});
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
			this._form.querySelector(`#${this.formName}-errors`),
			value
		);
	}

	resetForm() {
		this._form.reset();
	}
}

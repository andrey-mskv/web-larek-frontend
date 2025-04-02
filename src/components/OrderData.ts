import { IOrder, IOrderData, IOrderForm } from '../types';
import { errorCategory } from '../utils/constants';
import { EventEmitter } from './base/events';

export class OrderData implements IOrderData {
	private events: EventEmitter;
	private _order: IOrderForm = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};
	formErrors: Partial<IOrderForm> = {};

	constructor(events: EventEmitter) {
		this.events = events;
	}

	set payment(value: string) {
		this._order.payment = value;
		this.events.emit('order:select');
	}

	get payment() {
		return this._order.payment;
	}

	set address(value: string) {
		if (this.validTextInput(value)) this._order.address = value;
	}

	get address(): string {
		return this._order.address;
	}

	set email(value: string) {
		this._order.email = value;
	}

	get email(): string {
		return this._order.email;
	}

	set phone(value: string) {
		this._order.phone = value;
	}

	get phone(): string {
		return this._order.phone;
	}

	set order(order: IOrder) {
		this._order = order;
	}

	getData(): IOrderForm {	
		return this._order;	
	}

	cleanOrder(): void {
		this._order.address = '';
		this._order.email = '';
		this._order.phone = '';
		this._order.payment = '';
	}

	// проверка текстового поля
	protected validTextInput(input: string): boolean {
		return input.trim() !== '' && input.trim().length >= 3;
	}

	// проверка email
	protected validEmailInput(input: string): boolean {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(input);
	}

	// проверка номера телефона
	protected validPhoneInput(input: string): boolean {
		const phonePattern = /^\+7\d{10}$|8\d{10}$/;
		return phonePattern.test(input);
	}

	setOrederParams(field: keyof IOrderForm, value: string) {
		this._order[field] = value;

		if (this.validateOrder(field)) {
			this.events.emit('order:ready', this.order);
		}
	}

	protected validateOrder(field: keyof IOrderForm) {
		const errors: typeof this.formErrors = { ...this.formErrors };

		if (!this.validateField(field, this._order[field])) {
			errors[field] = errorCategory[field];
		} else {
			delete errors[field];
		}

		if (!this._order.payment) {
			errors.payment = errorCategory.payment;
		} else {
			delete errors.payment;
		}

		this.formErrors = errors;

		this.events.emit('formErrors:change', this.formErrors);
		return Object.values(errors).length === 0;
	}

	protected validateField(field: keyof IOrderForm, value: string) {
		const validators = {
			address: this.validTextInput,
			email: this.validEmailInput,
			phone: this.validPhoneInput,
		};
		if (field in validators) {
			return validators[field as keyof typeof validators](value);
		}
		return true;
	}

	cleanErrors() {
		this.formErrors = {};
	}

	getErrorsValues() {
		return Object.values(this.formErrors)
			.filter((i) => !!i)
			.join('; ');
	}

	getOrderValid() {
		return (
			this._order.payment && this.validateField('address', this._order.address)
		);
	}

	getContactValid() {
		return (
			this.validateField('email', this._order.email) &&
			this.validateField('phone', this._order.phone)
		);
	}
}

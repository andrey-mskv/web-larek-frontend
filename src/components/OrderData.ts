import { IOrder, IOrderData, IOrderForm } from '../types';
import { errorCategory } from '../utils/constants';
import { EventEmitter } from './base/events';

// type FormErrors = Partial<Record<keyof IOrder, string>>;

export class OrderData implements IOrderData {
	private events: EventEmitter;
	private _order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	formErrors: Partial<Record<keyof IOrder, string>> = {};

	constructor(events: EventEmitter) {
		this.events = events;
	}

	get payment() {
		return this._order.payment;
	}

	set address(value: string) {
		if (this.validTextInput(value)) this._order.address = value;
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

	set items(items: string[]) {
		this._order.items = items;
	}

	get order(): IOrder {
		return this._order;
	}

	set total(total: number) {
		this._order.total = total;
	}

	cleanOrder(): void {
		this._order.items = [];
		this._order.address = '';
		this._order.email = '';
		this._order.phone = '';
		this._order.payment = '';
		this._order.total = 0;
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

	// private sanitizePhoneInput(input: string) {
	// 	return input.replace(/\D/g, '');
	// }

	setOrederParams(field: keyof IOrderForm, value: string) {
		this._order[field] = value; // значение инпута или 'способа оплаты'

		if (this.validateOrder(field)) {
			this.events.emit('order:ready', this.order);
		}
	}

	set payment(value: string) {
		this._order.payment = value;
		this.events.emit('order:select');
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
		return Object.values(errors).length === 0; // true - если нет ошибок
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

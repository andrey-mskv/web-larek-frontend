import { IOrder } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const itemCategory: { [key: string]: string } = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
};

export const errorCategory: { [key: string]: string } = {
	payment: 'Выберите способ оплаты',
	address: 'Необходимо указать адрес',
	email: 'Необходимо указать email',
	phone: 'Необходимо указать телефон',
};

import { IItem, ILarekApi, IOrder, TOrderAnswer } from '../types';
import { Api } from './base/api';

interface IApi<T> {
	total: number;
	items: T[];
}

export class AppApi extends Api implements ILarekApi {
	private _cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this._cdn = cdn;
	}

	getItems(): Promise<IItem[]> {
		return this.get(`/product`).then((data: IApi<IItem>) =>
			data.items.map((item) => ({ ...item, image: this._cdn + item.image }))
		);
	}

	getItem(id: string): Promise<IItem> {
		return this.get(`/product/${id}`).then((data: IItem) => ({
			...data,
			image: this._cdn + data.image,
		}));
	}

	postOrder(order: IOrder): Promise<TOrderAnswer> {
		return this.post(`/order`, order).then((response: TOrderAnswer) => {
			console.log('Ответ сервера:', response);
			return response;
		});
	}
}

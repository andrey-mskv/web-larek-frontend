import { IItem, IItemsData } from '../types';
import { Api, ApiListResponse } from './base/api';

export class ShopAPI extends Api {
	// constructor(baseUrl: string, options?: RequestInit) {
	// 	super(baseUrl, options);
	// }

	getItemsList() {
		return this.get('/product/').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({ ...item }))
		);
	}
}

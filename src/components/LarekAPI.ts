import { IItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class ShopAPI extends Api {
	getItemsList() {
		return this.get('/product/').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({ ...item }))
		);
	}
}

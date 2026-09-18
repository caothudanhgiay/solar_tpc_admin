import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { API_ITEMS } from '../utils/constants';

export const TsoItemApi = {
  getItemsPage(page: number, size: number, keyword?: string) {
    return apiGet(`${API_ITEMS}/page`, { page, size, keyword });
  },
  getItemById(id: number) {
    return apiGet(`${API_ITEMS}/${id}`);
  },
  createItem(data: any) {
    return apiPost(API_ITEMS, data);
  },
  updateItem(id: number, data: any) {
    return apiPut(`${API_ITEMS}/${id}`, data);
  },
  deleteItem(id: number) {
    return apiDelete(`${API_ITEMS}/${id}`);
  },
  getGroupsByItemCode(itemCode: string) {
    return apiGet(`${API_ITEMS}/groups`, { itemCode });
  },
  getSubItemsByGroupCode(groupItemCode: string) {
    return apiGet(`${API_ITEMS}/sub-items`, { groupItemCode });
  },
};

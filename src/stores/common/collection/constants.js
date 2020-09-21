/**
 * Internal dependencies
 */
import { STATUS_LOADING } from '../constants';

export { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from '../constants';

export const DEFAULT_STATE = {
	categories: [],
	itemList: [],
	items: {},
	status: {
		categories: STATUS_LOADING,
		items: STATUS_LOADING,
	},
};

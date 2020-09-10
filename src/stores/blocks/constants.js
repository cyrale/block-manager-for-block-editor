import { STATUS_LOADING } from '../constants';

export { BLOCKS_API_PATH, BLOCK_CATEGORIES_API_PATH } from '../../api/blocks';
export { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from '../constants';

export const BLOCKS_STORE = 'bmfbe/blocks';

export const DEFAULT_STATE = {
	status: STATUS_LOADING,
	categories: [],
	blocks: {},
	list: [],
};

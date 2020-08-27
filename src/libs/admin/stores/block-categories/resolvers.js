import * as actions from './actions';
import { BLOCK_CATEGORIES_API_PATH } from './constants';

export function* getBlockCategories() {
	const categories = yield actions.fetchAllFromAPI(
		BLOCK_CATEGORIES_API_PATH
	);
	return actions.initBlockCategories( categories );
}

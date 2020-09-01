import * as actions from './actions';

export function* getBlockCategories() {
	const categories = yield actions.fetchAllCategoriesFromAPI();

	return actions.initBlockCategories( categories );
}

export function* getBlocks() {
	const blocks = yield actions.fetchAllFromAPI();

	return actions.initBlocks( blocks );
}

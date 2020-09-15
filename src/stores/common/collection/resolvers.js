/**
 * Internal dependencies
 */
import * as actions from './actions';

export function* getCategories() {
	const categories = yield actions.fetchAllCategoriesFromAPI();

	return actions.initCategories( categories );
}

export function* getCollection() {
	const items = yield actions.fetchAllFromAPI();

	return actions.initCollection( items );
}

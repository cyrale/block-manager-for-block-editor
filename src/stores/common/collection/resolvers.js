/**
 * Internal dependencies
 */
import { STATUS_LOADING } from '../constants';
import * as actions from './actions';

export function* getCategories() {
	yield actions.changeStatus( 'categories', STATUS_LOADING );

	const categories = yield actions.fetchAllCategoriesFromAPI();

	return actions.initCategories( categories );
}

export function* getCollection() {
	yield actions.changeStatus( 'items', STATUS_LOADING );

	const items = yield actions.fetchAllFromAPI();

	return actions.initCollection( items );
}

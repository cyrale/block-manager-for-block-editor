/**
 * Internal dependencies
 */
import { STATUS_PENDING, STATUS_SAVING } from '../constants';

export { fetchAllCategoriesFromAPI, fetchAllFromAPI } from '../actions';

export function changeStatus( name, status ) {
	return {
		name,
		status,
		type: 'CHANGE_STATUS',
	};
}

export function initCategories( categories ) {
	return {
		categories,
		type: 'INIT_CATEGORIES',
	};
}

export function initCollection( items ) {
	return {
		items,
		type: 'INIT_COLLECTION',
	};
}

export function updateItem( name, value ) {
	return {
		name,
		type: 'UPDATE_ITEM',
		value,
	};
}

export function* saveItem( item ) {
	yield {
		name: 'items',
		status: STATUS_SAVING,
		type: 'CHANGE_STATUS',
	};

	yield {
		item,
		type: 'SAVE_ITEM_START',
	};

	const savedItem = yield {
		item,
		type: 'SAVE_ITEM',
	};

	yield {
		name: savedItem.name,
		resetInitialValue: true,
		type: 'UPDATE_ITEM',
		value: savedItem,
	};

	yield {
		item,
		type: 'SAVE_ITEM_FINISH',
	};

	yield {
		name: 'items',
		status: STATUS_PENDING,
		type: 'CHANGE_STATUS',
	};

	return savedItem;
}

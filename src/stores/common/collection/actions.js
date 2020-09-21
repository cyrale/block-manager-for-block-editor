/**
 * Internal dependencies
 */
import { STATUS_PENDING, STATUS_SAVING } from '../constants';

export { fetchAllCategoriesFromAPI, fetchAllFromAPI } from '../actions';

export function changeStatus( name, status ) {
	return {
		type: 'CHANGE_STATUS',
		name,
		status,
	};
}

export function initCategories( categories ) {
	return {
		type: 'INIT_CATEGORIES',
		categories,
	};
}

export function initCollection( items ) {
	return {
		type: 'INIT_COLLECTION',
		items,
	};
}

export function updateItem( name, value ) {
	return {
		type: 'UPDATE_ITEM',
		name,
		value,
	};
}

export function* saveItem( item ) {
	yield {
		type: 'CHANGE_STATUS',
		name: 'items',
		status: STATUS_SAVING,
	};

	yield {
		type: 'SAVE_ITEM_START',
		item,
	};

	const savedItem = yield {
		type: 'SAVE_ITEM',
		item,
	};

	yield {
		type: 'UPDATE_ITEM',
		name: savedItem.name,
		value: savedItem,
		resetInitialValue: true,
	};

	yield {
		type: 'SAVE_ITEM_FINISH',
		item,
	};

	yield {
		type: 'CHANGE_STATUS',
		name: 'items',
		status: STATUS_PENDING,
	};

	return savedItem;
}

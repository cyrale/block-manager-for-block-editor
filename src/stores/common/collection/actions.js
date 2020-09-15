export { fetchAllCategoriesFromAPI, fetchAllFromAPI } from '../actions';

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
	};

	yield {
		type: 'SAVE_ITEM_FINISH',
		item,
	};

	return savedItem;
}

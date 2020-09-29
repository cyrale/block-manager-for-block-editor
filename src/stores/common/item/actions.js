export { fetchAllFromAPI } from '../actions';

export function initItem( item ) {
	return {
		item,
		type: 'INIT_ITEM',
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
		type: 'SAVE_ITEM_START',
	};

	const savedItem = yield {
		item,
		type: 'SAVE_ITEM',
	};

	yield {
		item: savedItem,
		type: 'INIT_ITEM',
	};

	yield {
		type: 'SAVE_ITEM_FINISH',
	};

	return savedItem;
}

export { fetchAllFromAPI } from '../actions';

export function initItem( item ) {
	return {
		type: 'INIT_ITEM',
		item,
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
	};

	const savedItem = yield {
		type: 'SAVE_ITEM',
		item,
	};

	yield {
		type: 'INIT_ITEM',
		item: savedItem,
	};

	yield {
		type: 'SAVE_ITEM_FINISH',
	};

	return savedItem;
}

export { fetchAllFromAPI } from '../actions';

export function initBlockCategories( settings ) {
	return {
		type: 'INIT_BLOCK_CATEGORIES',
		settings,
	};
}

export function updateBlockCategories( name, value ) {
	return {
		type: 'UPDATE_BLOCK_CATEGORIES',
		name,
		value,
	};
}

export function* saveBlockCategories( settings ) {
	yield {
		type: 'SAVE_BLOCK_CATEGORIES_START',
	};

	const savedCategories = yield {
		type: 'SAVE_BLOCK_CATEGORIES',
		settings,
	};

	yield {
		type: 'INIT_BLOCK_CATEGORIES',
		settings: savedCategories,
	};

	yield {
		type: 'SAVE_BLOCK_CATEGORIES_FINISH',
	};

	return savedCategories;
}

export function loadingStatus() {
	return {
		type: 'LOADING_STATUS',
	};
}

export function savingStatus() {
	return {
		type: 'SAVING_STATUS',
	};
}

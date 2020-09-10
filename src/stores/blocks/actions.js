export { fetchAllCategoriesFromAPI, fetchAllFromAPI } from '../actions';

export function initBlockCategories( categories ) {
	return {
		type: 'INIT_BLOCK_CATEGORIES',
		categories,
	};
}

export function initBlocks( blocks ) {
	return {
		type: 'INIT_BLOCKS',
		blocks,
	};
}

export function createBlocks( blocks ) {
	return {
		type: 'CREATE_BLOCKS',
		blocks,
	};
}

export function updateBlocks( blocks ) {
	return {
		type: 'UPDATE_BLOCKS',
		blocks,
	};
}

export function deleteBlocks( blocks ) {
	return {
		type: 'DELETE_BLOCKS',
		blocks,
	};
}

export function updateBlock( name, value ) {
	return {
		type: 'UPDATE_BLOCK',
		name,
		value,
	};
}

export function* saveBlock( block ) {
	yield {
		type: 'SAVE_BLOCK_START',
		block,
	};

	const savedBlock = yield {
		type: 'SAVE_BLOCK',
		block,
	};

	yield updateBlock( savedBlock.name, savedBlock );

	yield {
		type: 'SAVE_BLOCK_FINISH',
		block,
	};

	return savedBlock;
}

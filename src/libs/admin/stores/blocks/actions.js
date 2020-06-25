export { fetchAllFromAPI } from '../actions';

export function initBlocks( blocks ) {
	return {
		type: 'INIT_BLOCKS',
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

	yield {
		type: 'UPDATE_BLOCK',
		name: savedBlock.name,
		value: savedBlock,
	};

	yield {
		type: 'SAVE_BLOCK_FINISH',
		block,
	};

	return savedBlock;
}

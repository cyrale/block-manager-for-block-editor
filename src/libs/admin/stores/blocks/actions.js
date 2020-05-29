import { apiFetch } from '../settings/controls';
export { fetchFromAPI } from '../actions';
import { BLOCKS_API_PATH } from './constants';

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

	const savedBlock = yield apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ block.name }`,
		method: 'PUT',
		data: block,
	} );

	yield {
		type: 'SAVE_BLOCK_FINISH',
		block,
	};

	return savedBlock;
}

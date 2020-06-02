import * as actions from './actions';
import { BLOCKS_API_PATH } from './constants';

const {
	url: { addQueryArgs },
} = wp;

export function* getCategories() {
	return getBlocks();
}

export function* getBlocks() {
	const blocks = yield actions.fetchFromAPI(
		addQueryArgs( BLOCKS_API_PATH, { per_page: -1 } )
	);

	return actions.initBlocks( blocks );
}

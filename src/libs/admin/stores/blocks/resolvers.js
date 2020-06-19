import { addQueryArgs } from '@wordpress/url';

import * as actions from './actions';
import { BLOCKS_API_PATH } from './constants';

export function* getCategorizedBlocks() {
	yield getBlocks();
}

export function* getBlocks() {
	const blocks = yield actions.fetchAllFromAPI(
		addQueryArgs( BLOCKS_API_PATH, { per_page: -1 } )
	);

	return actions.initBlocks( blocks );
}

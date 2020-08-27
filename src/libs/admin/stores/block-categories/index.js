import { registerStore } from '@wordpress/data';

import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';
import * as selectors from './selectors';
import { BLOCK_CATEGORIES_STORE } from './constants';
import reducer from './reducer';

registerStore( BLOCK_CATEGORIES_STORE, {
	reducer,
	actions,
	controls,
	resolvers,
	selectors,
} );

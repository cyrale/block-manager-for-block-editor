const {
	data: { registerStore },
} = wp;

import reducer from './reducer';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';
import * as selectors from './selectors';
import { BLOCKS_PANEL_STORE } from './constants';

registerStore( BLOCKS_PANEL_STORE, {
	reducer,
	actions,
	controls,
	resolvers,
	selectors,
} );

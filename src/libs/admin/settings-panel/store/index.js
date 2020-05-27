const {
	data: { registerStore },
} = wp;

import reducer from './reducer';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';
import * as selectors from './selectors';
import { SETTINGS_STORE } from './constants';

export const storeConfig = { reducer, actions, controls, resolvers, selectors };

registerStore( SETTINGS_STORE, storeConfig );

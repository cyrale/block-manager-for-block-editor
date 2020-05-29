import reducer from './reducer';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';
import * as selectors from './selectors';
import { SETTINGS_PANEL_STORE } from './constants';

const {
	data: { registerStore },
} = wp;

registerStore( SETTINGS_PANEL_STORE, {
	reducer,
	actions,
	controls,
	resolvers,
	selectors,
} );

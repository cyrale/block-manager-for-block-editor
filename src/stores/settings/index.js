import { registerStore } from '@wordpress/data';

import * as actions from '../common/single-item/actions';
import * as controls from './controls';
import * as resolvers from '../common/single-item/resolvers';
import * as selectors from '../common/single-item/selectors';
import { ITEM_STORE } from './constants';
import reducer from './reducer';

registerStore( ITEM_STORE, {
	reducer,
	actions,
	controls,
	resolvers,
	selectors,
} );

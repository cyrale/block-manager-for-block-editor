/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as actions from '../common/item/actions';
import * as controls from './controls';
import * as resolvers from '../common/item/resolvers';
import * as selectors from '../common/item/selectors';
import { ITEM_STORE } from './constants';
import reducer from './reducer';

registerStore( ITEM_STORE, {
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
} );

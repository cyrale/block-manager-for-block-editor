/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';
import * as selectors from '../common/collection/selectors';
import { COLLECTION_STORE } from './constants';
import reducer from './reducer';

registerStore( COLLECTION_STORE, {
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
} );

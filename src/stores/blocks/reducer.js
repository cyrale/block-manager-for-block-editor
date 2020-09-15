/**
 * Internal dependencies
 */
import { DEFAULT_STATE } from '../common/collection/constants';
import collectionReducer from '../common/collection/reducer';

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
	}

	return collectionReducer( state, action );
}

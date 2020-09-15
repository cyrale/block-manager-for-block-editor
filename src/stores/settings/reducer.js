/**
 * Internal dependencies
 */
import { DEFAULT_STATE } from '../common/single-item/constants';
import collectionReducer from '../common/single-item/reducer';

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
	}

	return collectionReducer( state, action );
}

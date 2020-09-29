/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import { DEFAULT_STATE, STATUS_PENDING, STATUS_SAVING } from './constants';

export function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_ITEM':
			return {
				...state,
				initialValue: cloneDeep( action.item ),
				status: STATUS_PENDING,
				value: action.item,
			};

		case 'UPDATE_ITEM':
			return {
				...state,
				value: {
					...state.value,
					[ action.name ]: action.value,
				},
			};

		case 'SAVE_ITEM_START':
		case 'SAVE_ITEM_FINISH':
			return {
				...state,
				status:
					action.type === 'SAVE_ITEM_START'
						? STATUS_SAVING
						: STATUS_PENDING,
			};
	}

	return state;
}

export default reducer;

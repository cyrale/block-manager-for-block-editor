import { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from './constants';

const DEFAULT_STATE = {
	status: STATUS_LOADING,
	value: {},
};

export function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_BLOCK_CATEGORIES':
			return {
				...state,
				status: STATUS_PENDING,
				value: action.settings,
			};

		case 'UPDATE_BLOCK_CATEGORIES':
			return {
				...state,
				value: {
					...state.value,
					[ action.name ]: action.value,
				},
			};

		case 'SAVE_BLOCK_CATEGORIES_START':
		case 'SAVE_BLOCK_CATEGORIES_FINISH':
			return {
				...state,
				status:
					action.type === 'SAVE_BLOCK_CATEGORIES_START'
						? STATUS_SAVING
						: STATUS_PENDING,
			};
	}

	return state;
}

export default reducer;

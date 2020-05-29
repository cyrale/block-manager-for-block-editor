import { STATUS_PENDING, STATUS_LOADING, STATUS_SAVING } from './constants';

const DEFAULT_STATE = {
	status: STATUS_LOADING,
	value: {},
};

export function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_SETTINGS':
			return {
				...state,
				status: STATUS_PENDING,
				value: action.settings,
			};

		case 'UPDATE_SETTINGS':
			return {
				...state,
				value: {
					...state.value,
					[ action.name ]: action.value,
				},
			};

		case 'SAVE_SETTINGS_START':
		case 'SAVE_SETTINGS_FINISH':
			return {
				...state,
				status:
					action.type !== 'SAVE_SETTINGS_START'
						? STATUS_SAVING
						: STATUS_PENDING,
			};
	}

	return state;
}

export default reducer;

import { STATUS_FINISHED, STATUS_PENDING } from './constants';

const DEFAULT_SETTINGS_STATE = {
	loadingStatus: STATUS_PENDING,
	savingStatus: STATUS_FINISHED,
	value: {},
};

export function reducer( state = DEFAULT_SETTINGS_STATE, action ) {
	switch ( action.type ) {
		case 'SET_SETTINGS':
			return {
				...state,
				loadingStatus: STATUS_FINISHED,
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
				savingStatus:
					action.type !== 'SAVE_SETTINGS_FINISH'
						? STATUS_PENDING
						: STATUS_FINISHED,
			};
	}

	return state;
}

export default reducer;

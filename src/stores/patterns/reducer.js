import { merge } from 'lodash';

import { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from './constants';

const DEFAULT_STATE = {
	status: STATUS_LOADING,
	patterns: {},
	list: [],
	categories: [],
};

export function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_PATTERN_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			};

		case 'INIT_PATTERNS':
			const patternsObject = {};
			action.patterns.forEach( ( pattern ) => {
				patternsObject[ pattern.name ] = {
					status: STATUS_PENDING,
					value: pattern,
				};
			} );

			const patterns = { ...state.patterns, ...patternsObject };

			const list = Object.values( patterns ).map( ( pattern ) => ( {
				categories: pattern.value.categories,
				name: pattern.value.name,
			} ) );

			return {
				...state,
				status: STATUS_PENDING,
				patterns,
				list,
			};

		case 'UPDATE_PATTERN':
			state.patterns[ action.name ].value = merge(
				{},
				state.patterns[ action.name ].value,
				action.value
			);

			return { ...state };

		case 'SAVE_PATTERN_START':
		case 'SAVE_PATTERN_FINISH':
			const globalSavingStatus = Object.values( state.patterns ).reduce(
				( savingStatus, pattern ) =>
					savingStatus ||
					( STATUS_SAVING === pattern.status &&
						pattern.value.name !== action.pattern.name ),
				false
			);

			return {
				...state,
				status:
					'SAVE_PATTERN_START' === action.type || globalSavingStatus
						? STATUS_SAVING
						: STATUS_PENDING,
				patterns: {
					...state.patterns,
					[ action.pattern.name ]: {
						...state.patterns[ action.pattern.name ],
						status:
							'SAVE_PATTERN_START' === action.type
								? STATUS_SAVING
								: STATUS_PENDING,
					},
				},
			};
	}

	return state;
}

export default reducer;

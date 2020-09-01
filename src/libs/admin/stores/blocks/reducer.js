import { merge } from 'lodash';

import { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from './constants';

const DEFAULT_STATE = {
	status: STATUS_LOADING,
	blocks: {},
	list: [],
	categories: [],
};

export function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_BLOCK_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			};

		case 'INIT_BLOCKS':
			const blocksObject = {};
			action.blocks.forEach( ( block ) => {
				blocksObject[ block.name ] = {
					status: STATUS_PENDING,
					value: block,
				};
			} );

			const blocks = { ...state.blocks, ...blocksObject };

			const list = Object.values( blocks ).map( ( block ) => ( {
				category: block.value.category,
				name: block.value.name,
			} ) );

			// const categories = Object.values( blocks ).reduce(
			// 	( cats, block ) => {
			// 		if ( ! cats.includes( block.value.category ) ) {
			// 			cats.push( block.value.category );
			// 		}

			// 		return cats;
			// 	},
			// 	[]
			// );

			return {
				...state,
				status: STATUS_PENDING,
				blocks,
				list,
				// categories,
			};

		case 'UPDATE_BLOCK':
			state.blocks[ action.name ].value = merge(
				{},
				state.blocks[ action.name ].value,
				action.value
			);

			return { ...state };

		case 'SAVE_BLOCK_START':
		case 'SAVE_BLOCK_FINISH':
			const globalSavingStatus = Object.values( state.blocks ).reduce(
				( savingStatus, block ) =>
					savingStatus ||
					( STATUS_SAVING === block.status &&
						block.value.name !== action.block.name ),
				false
			);

			return {
				...state,
				status:
					'SAVE_BLOCK_START' === action.type || globalSavingStatus
						? STATUS_SAVING
						: STATUS_PENDING,
				blocks: {
					...state.blocks,
					[ action.block.name ]: {
						...state.blocks[ action.block.name ],
						status:
							'SAVE_BLOCK_START' === action.type
								? STATUS_SAVING
								: STATUS_PENDING,
					},
				},
			};
	}

	return state;
}

export default reducer;

/**
 * External dependencies
 */
import { merge, pick } from 'lodash';

/**
 * Internal dependencies
 */
import { DEFAULT_STATE, STATUS_PENDING, STATUS_SAVING } from './constants';

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_BLOCK_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			};

		case 'INIT_BLOCKS':
			const blocks = {};
			const list = [];

			action.blocks.forEach( ( block ) => {
				blocks[ block.name ] = {
					status: STATUS_PENDING,
					value: block,
				};

				list.push( pick( block, [ 'name', 'category' ] ) );
			} );

			return {
				...state,
				status: STATUS_PENDING,
				blocks,
				list,
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

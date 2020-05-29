import { STATUS_FINISHED, STATUS_PENDING } from './constants';

const { merge, omit } = lodash;

const DEFAULT_BLOCKS_STATE = {
	loadingStatus: STATUS_PENDING,
	blocks: {},
	list: [],
	categories: [],
};

export function reducer( state = DEFAULT_BLOCKS_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_BLOCKS':
			const blocksObject = {};
			action.blocks.forEach( ( block ) => {
				blocksObject[ block.name ] = {
					savingStatus: STATUS_FINISHED,
					value: omit( block, [ '_links' ] ),
				};
			} );

			const blocks = { ...state.blocks, ...blocksObject };

			const list = Object.values( blocks ).map( ( block ) => ( {
				category: block.value.category,
				name: block.value.name,
			} ) );

			const categories = Object.values( blocks ).reduce(
				( cats, block ) => {
					if ( ! cats.includes( block.value.category ) ) {
						cats.push( block.value.category );
					}

					return cats;
				},
				[]
			);

			return {
				...state,
				loadingStatus: STATUS_FINISHED,
				blocks,
				list,
				categories,
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
			return {
				...state,
				blocks: {
					...state.blocks,
					[ action.block.name ]: {
						...state.blocks[ action.block.name ],
						savingStatus:
							action.type !== 'SAVE_BLOCK_FINISH'
								? STATUS_PENDING
								: STATUS_FINISHED,
					},
				},
			};
	}

	return state;
}

export default reducer;

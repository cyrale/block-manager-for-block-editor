/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

/**
 * Internal dependencies
 */
import { DEFAULT_STATE, STATUS_PENDING, STATUS_SAVING } from './constants';

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'INIT_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			};

		case 'INIT_COLLECTION':
			const items = {};
			const itemList = [];

			action.items.forEach( ( item ) => {
				items[ item.name ] = {
					status: STATUS_PENDING,
					initialValue: cloneDeep( item ),
					value: item,
				};

				const itemForList = {
					name: item.name,
					categories: [],
				};

				if ( undefined !== item.category ) {
					itemForList.categories = [ item.category ];
				} else if ( Array.isArray( item.categories ) ) {
					itemForList.categories = item.categories;
				}

				itemList.push( itemForList );
			} );

			return {
				...state,
				itemList,
				items,
			};

		case 'UPDATE_ITEM':
			state.items[ action.name ].value = merge(
				{},
				state.items[ action.name ].value,
				action.value
			);

			return { ...state };

		case 'SAVE_ITEM_START':
		case 'SAVE_ITEM_FINISH':
			return {
				...state,
				items: {
					...state.items,
					[ action.item.name ]: {
						...state.items[ action.item.name ],
						status:
							'SAVE_ITEM_START' === action.type
								? STATUS_SAVING
								: STATUS_PENDING,
					},
				},
			};
	}

	return state;
}

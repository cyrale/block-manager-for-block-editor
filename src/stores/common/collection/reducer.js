/**
 * External dependencies
 */
import { cloneDeep, isString, merge, omit } from 'lodash';

/**
 * Internal dependencies
 */
import { DEFAULT_STATE, STATUS_PENDING, STATUS_SAVING } from './constants';

export default function reducer( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'CHANGE_STATUS':
			return {
				...state,
				status: {
					...state.status,
					[ action.name ]: action.status,
				},
			};

		case 'INIT_CATEGORIES':
			const categories = action.categories.map( ( category ) => {
				return {
					slug: category.name ?? category.slug,
					title: category.label ?? category.title,
				};
			} );

			return {
				...state,
				categories,
				status: {
					...state.status,
					categories: STATUS_PENDING,
				},
			};

		case 'INIT_COLLECTION':
			const items = {};
			const itemList = [];

			action.items
				.map( ( item ) => {
					let itemCategories = [];

					if ( isString( item.category ) ) {
						itemCategories = [ item.category ];
					} else if ( Array.isArray( item.categories ) ) {
						itemCategories = item.categories;
					}

					return {
						...omit( item, [ 'category' ] ),
						categories: itemCategories,
					};
				} )
				.forEach( ( item ) => {
					items[ item.name ] = {
						initialValue: cloneDeep( item ),
						status: STATUS_PENDING,
						value: item,
					};

					itemList.push( {
						categories: item.categories,
						name: item.name,
					} );
				} );

			return {
				...state,
				itemList,
				items,
				status: {
					...state.status,
					items: STATUS_PENDING,
				},
			};

		case 'UPDATE_ITEM':
			state.items[ action.name ].value = merge(
				{},
				state.items[ action.name ].value,
				action.value
			);

			if ( action.resetInitialValue ) {
				state.items[ action.name ].initialValue = cloneDeep(
					state.items[ action.name ].value
				);
			}

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

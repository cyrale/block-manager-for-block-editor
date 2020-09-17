/**
 * External dependencies
 */
import { find, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from './constants';

export function getCategories( { categories } ) {
	return categories;
}

export function getCollection( { itemList } ) {
	return itemList;
}

export function getItem( { items }, name ) {
	return items[ name ].value;
}

export function getStatus( { items }, name = '' ) {
	if ( '' === name ) {
		return Object.values( items ).reduce( ( status, item ) => {
			if ( STATUS_LOADING !== status && STATUS_LOADING === item.status ) {
				status = STATUS_LOADING;
			} else if (
				STATUS_SAVING !== status &&
				STATUS_SAVING === item.status
			) {
				status = STATUS_SAVING;
			}

			return status;
		}, STATUS_PENDING );
	}

	if ( items[ name ] ) {
		return items[ name ].status;
	}

	return null;
}

export function getModified( { itemList, items } ) {
	return Object.values( items )
		.filter( ( item ) => ! isEqual( item.initialValue, item.value ) )
		.map( ( { value: { name } } ) => find( itemList, { name } ) );
}

export function isModified( state, name = '' ) {
	const { items } = state;

	if ( '' === name ) {
		return getModified( state ).length > 0;
	}

	if ( items[ name ] ) {
		return ! isEqual( items[ name ].initialValue, items[ name ].value );
	}

	return null;
}

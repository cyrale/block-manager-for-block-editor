/**
 * External dependencies
 */
import { isEqual } from 'lodash';

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

export function isModified( { items }, name = '' ) {
	if ( '' === name ) {
		return Object.values( items ).reduce(
			( modified, item ) =>
				modified || ! isEqual( item.initialValue, item.value ),
			false
		);
	}

	if ( items[ name ] ) {
		return ! isEqual( items[ name ].initialValue, items[ name ].value );
	}

	return null;
}

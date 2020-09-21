/**
 * External dependencies
 */
import { find, isEqual } from 'lodash';

export function getCategories( { categories } ) {
	return categories;
}

export function getCollection( { itemList } ) {
	return itemList;
}

export function getItem( { items }, name ) {
	return items[ name ].value;
}

export function getStatus( { items, status }, name = '' ) {
	if ( '' === name ) {
		return status.items;
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

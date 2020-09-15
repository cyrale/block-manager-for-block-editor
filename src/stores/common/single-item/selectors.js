/**
 * External dependencies
 */
import { isEqual } from 'lodash';

export function getItem( { value } ) {
	return value;
}

export function getStatus( { status } ) {
	return status;
}

export function isModified( { initialValue, value } ) {
	return ! isEqual( value, initialValue );
}

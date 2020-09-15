/**
 * External dependencies
 */
import { chunk } from 'lodash';

/**
 * Internal dependencies
 */
import {
	allBlockCategories,
	allBlocks,
	createBlock,
	deleteBlock,
	updateBlock,
} from '../../api/blocks';

export const API_FETCH_ALL_CATEGORIES = allBlockCategories;
export const API_FETCH_ALL = allBlocks;

function batchProcess( items, cb ) {
	return chunk( items, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all( part.map( ( item ) => cb( item ) ) ) ),
		],
		[]
	);
}

export function CREATE_ITEMS( { items } ) {
	return batchProcess( items, createBlock );
}

export function UPDATE_ITEMS( { items } ) {
	return batchProcess( items, updateBlock );
}

export function DELETE_ITEMS( { items } ) {
	return batchProcess( items, deleteBlock );
}

export function SAVE_ITEM( { item } ) {
	return updateBlock( item );
}

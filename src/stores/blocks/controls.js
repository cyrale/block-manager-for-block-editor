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

export function CREATE_ITEMS( { items } ) {
	return chunk( items, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( item ) => createBlock( item ) )
			) ),
		],
		[]
	);
}

export function UPDATE_ITEMS( { items } ) {
	return chunk( items, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( item ) => updateBlock( item ) )
			) ),
		],
		[]
	);
}

export function DELETE_ITEMS( { items } ) {
	return chunk( items, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( { name } ) => deleteBlock( name ) )
			) ),
		],
		[]
	);
}

export function SAVE_ITEM( { item } ) {
	return updateBlock( item );
}

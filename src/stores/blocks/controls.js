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

export function API_FETCH_ALL_CATEGORIES() {
	return allBlockCategories();
}

export function API_FETCH_ALL() {
	return allBlocks();
}

export function CREATE_BLOCKS( { blocks } ) {
	return chunk( blocks, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( block ) => createBlock( block ) )
			) ),
		],
		[]
	);
}

export function UPDATE_BLOCKS( { blocks } ) {
	return chunk( blocks, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( block ) => updateBlock( block ) )
			) ),
		],
		[]
	);
}

export function DELETE_BLOCKS( { blocks } ) {
	return chunk( blocks, 10 ).reduce(
		async ( memo, part ) => [
			...( await memo ),
			...( await Promise.all(
				part.map( ( { name } ) => deleteBlock( name ) )
			) ),
		],
		[]
	);
}

export function SAVE_BLOCK( { block } ) {
	return updateBlock( block );
}

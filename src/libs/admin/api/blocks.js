import { omit } from 'lodash';

import * as apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, isValidPath } from '@wordpress/url';

/**
 * API path for blocks.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const BLOCKS_API_PATH = '/bmfbe/v1/blocks';

/**
 * Get all blocks.
 *
 * @return {Promise<Object[]>} All registered blocks.
 * @since 1.0.0
 */
export async function allBlocks() {
	const apiBlocks = await apiFetch( {
		path: addQueryArgs( BLOCKS_API_PATH, { per_page: -1 } ),
		method: 'GET',
	} );

	return apiBlocks.map( ( block ) => omit( block, [ '_links' ] ) );
}

/**
 * Get one block by name.
 *
 * @param {string} name Name of the block.
 *
 * @return {Promise<boolean|Object>} Searched block.
 * @since 1.0.0
 */
export async function oneBlock( name ) {
	if ( ! isValidPath( name ) ) {
		return false;
	}

	const block = await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ name }`,
		method: 'GET',
	} );

	return omit( block, [ '_links' ] );
}

/**
 * Create new block.
 *
 * @param {Object} block Block to create.
 *
 * @return {Promise<Object>} Created block.
 * @since 1.0.0
 */
export async function createBlock( block ) {
	const res = await apiFetch( {
		path: BLOCKS_API_PATH,
		method: 'POST',
		data: block,
	} );

	return omit( res, [ '_links' ] );
}

/**
 * Update a block.
 *
 * @param {Object} block Block to update with name property to identify it.
 *
 * @return {Promise<Object>} Updated block.
 * @since 1.0.0
 */
export async function updateBlock( block ) {
	const res = await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ block.name }`,
		method: 'PUT',
		data: block,
	} );

	return omit( res, [ '_links' ] );
}

/**
 * Delete a block.
 *
 * @param {string} name Name of the block to delete.
 *
 * @return {Promise<Object>} Deleted object.
 * @since 1.0.0
 */
export async function deleteBlock( name ) {
	return await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ name }`,
		method: 'DELETE',
	} );
}

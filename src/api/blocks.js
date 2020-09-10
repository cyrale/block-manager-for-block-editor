/**
 * External dependencies
 */
import { omit, pick } from 'lodash';

/**
 * WordPress dependencies
 */
import * as apiFetch from '@wordpress/api-fetch';
import { getBlockTypes } from '@wordpress/blocks';
import { addQueryArgs, isValidPath } from '@wordpress/url';

/**
 * API path for blocks.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const BLOCKS_API_PATH = '/bmfbe/v1/blocks';

/**
 * API path for block categories.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const BLOCK_CATEGORIES_API_PATH = '/bmfbe/v1/block-categories';

/**
 * Get all blocks registered in editor.
 *
 * @return {[]} List of all blocks in editor.
 * @since 1.0.0
 */
export function getEditorBlocks() {
	return (
		getBlockTypes() // Remove blocks not visible in inserter.
			.filter( ( block ) => block.supports?.inserter !== false )
			// Keep only necessary fields.
			.map( ( block ) =>
				pick( block, [
					'name',
					'title',
					'description',
					'category',
					'icon',
					'keywords',
					'supports_override',
					'supports',
					'styles',
					'variations',
				] )
			)
			// Sanitize values.
			.map( ( block ) => {
				// Sanitize supports.
				block.supports = block.supports ?? {};

				Object.keys( block.supports ).forEach( ( name ) => {
					if (
						! bmfbeAdminGlobal.availableSupports.includes( name )
					) {
						delete block.supports[ name ];
					} else {
						block.supports[ name ] = {
							value: block.supports[ name ],
						};
					}
				} );

				// Sanitize styles and variations.
				[ 'styles', 'variations' ].forEach( ( key ) => {
					block[ key ] = ( block[ key ] ?? [] ).map( ( v ) =>
						pick( v, [ 'name', 'isDefault', 'isActive' ] )
					);
				} );

				return block;
			} )
	);
}

/**
 * Get all block categories.
 *
 * @return {Promise<Object>} All block categories values.
 * @since 1.0.0
 */
export async function allBlockCategories() {
	return await apiFetch( {
		path: BLOCK_CATEGORIES_API_PATH,
		method: 'GET',
	} );
}

/**
 * Update block categories.
 *
 * @param {Object} categories Updated block categories values.
 *
 * @return {Promise<Object>} Updated block categories values.
 * @since 1.0.0
 */
export async function updateBlockCategories( categories ) {
	return await apiFetch( {
		path: BLOCK_CATEGORIES_API_PATH,
		method: 'PUT',
		data: categories,
	} );
}

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

import * as apiFetch from '@wordpress/api-fetch';

/**
 * API path for block categories.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const BLOCK_CATEGORIES_API_PATH = '/bmfbe/v1/block-categories';

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

/**
 * External dependencies.
 */
import { omit } from 'lodash';

/**
 * WordPress dependencies.
 */
import * as apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, isValidPath } from '@wordpress/url';

/**
 * API path for patterns.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const PATTERNS_API_PATH = '/bmfbe/v1/patterns';

/**
 * API path for pattern categories.
 *
 * @constant {string}
 * @since 1.0.0
 */
export const PATTERN_CATEGORIES_API_PATH = '/bmfbe/v1/pattern-categories';

/**
 * Get all pattern categories.
 *
 * @return {Promise<Object[]>} All registered pattern categories.
 * @since 1.0.0
 */
export async function allPatternCategories() {
	const apiPatternCategories = await apiFetch( {
		method: 'GET',
		path: addQueryArgs( PATTERN_CATEGORIES_API_PATH ),
	} );

	return apiPatternCategories;
}

/**
 * Get all patterns.
 *
 * @return {Promise<Object[]>} All registered patterns.
 * @since 1.0.0
 */
export async function allPatterns() {
	const apiPatterns = await apiFetch( {
		method: 'GET',
		path: addQueryArgs( PATTERNS_API_PATH, { per_page: -1 } ),
	} );

	return apiPatterns.map( ( block ) => omit( block, [ '_links' ] ) );
}

/**
 * Get one pattern by name.
 *
 * @param {string} name Name of the pattern.
 *
 * @return {Promise<boolean|Object>} Searched pattern.
 * @since 1.0.0
 */
export async function onePattern( name ) {
	if ( ! isValidPath( name ) ) {
		return false;
	}

	const block = await apiFetch( {
		method: 'GET',
		path: `${ PATTERNS_API_PATH }/${ name }`,
	} );

	return omit( block, [ '_links' ] );
}

/**
 * Update a pattern.
 *
 * @param {Object} pattern Pattern to update with name property to identify it.
 *
 * @return {Promise<Object>} Updated pattern.
 * @since 1.0.0
 */
export async function updatePattern( pattern ) {
	const res = await apiFetch( {
		data: pattern,
		method: 'PUT',
		path: `${ PATTERNS_API_PATH }/${ pattern.name }`,
	} );

	return omit( res, [ '_links' ] );
}

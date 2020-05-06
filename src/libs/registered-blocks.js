const { omit, pick } = lodash;
const {
	apiFetch,
	url: { addQueryArgs },
} = wp;

/**
 * List of saved fields for blocks.
 *
 * @type {string[]}
 * @since 1.0.0
 */
export const blockFields = [
	'name',
	'title',
	'description',
	'category',
	'icon',
	'keywords',
	'supportsOverride',
	'supports',
	'styles',
	'variations',
];

/**
 * Get registered blocks.
 *
 * @param {Object} data Pass data to the request.
 *
 * @return {Promise<Array>} Registered blocks.
 * @since 1.0.0
 */
export async function getRegisteredBlocks( data = {} ) {
	let registeredBlocks = [];

	let page = 1;
	let totalPages = 1;

	while ( page <= totalPages ) {
		const res = await getPagedRegisteredBlocks(
			Object.assign( {}, data, { page } ),
			{ parse: false }
		);

		if ( res.status !== 200 ) {
			break;
		}

		// Update total of pages.
		totalPages = Number( res.headers.get( 'x-wp-totalpages' ) );

		// Add blocks to global list.
		const blocks = await res.json();
		registeredBlocks = [ ...registeredBlocks, ...blocks ];

		// Update page counter.
		page++;
	}

	return registeredBlocks;
}

/**
 * Get registered blocks keeping API pagination.
 *
 * @param {Object} data Pass data to the request.
 * @param {Object} options Additional options to pass to the request.
 *
 * @return {*} Response from the API.
 * @since 1.0.0
 */
export function getPagedRegisteredBlocks( data = {}, options = {} ) {
	options = Object.assign( {}, omit( options, [ 'path', 'method' ] ), {
		path: addQueryArgs( '/bmfbe/v1/blocks', data ),
		method: 'GET',
	} );

	return apiFetch( options );
}

/**
 * Get a block.
 *
 * @param {string} name Name of the block.
 *
 * @return {*} Response from the API.
 * @since 1.0.0
 */
export function getBlock( name ) {
	return apiFetch( {
		path: `/bmfbe/v1/blocks/${ name }`,
		method: 'GET',
	} );
}

export function updateBlock( block ) {
	return apiFetch( {
		path: `/bmfbe/v1/blocks/${ block.name }`,
		method: 'PATCH',
		data: pick( block, blockFields ),
	} );
}

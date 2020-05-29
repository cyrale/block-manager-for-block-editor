const { omit } = lodash;
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
	'supports_override',
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
export async function getBlocks( data = {} ) {
	let registeredBlocks = [];

	let page = 1;
	let totalPages = 1;

	while ( page <= totalPages ) {
		const res = await getPagedBlocks( Object.assign( {}, data, { page } ), {
			parse: false,
		} );

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
export function getPagedBlocks( data = {}, options = {} ) {
	options = Object.assign( {}, omit( options, [ 'path', 'method' ] ), {
		path: addQueryArgs( '/bmfbe/v1/blocks', data ),
		method: 'GET',
	} );

	return apiFetch( options );
}

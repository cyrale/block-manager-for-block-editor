const { pick } = lodash;
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
	'supports',
	'styles',
	'variations',
];

/**
 * Get registered blocks.
 *
 * @return {Promise<Array>} List of registered blocks.
 * @since 1.0.0
 */
export async function getRegisteredBlocks() {
	let registeredBlocks = [];

	const res = await apiFetch( { path: '/bmfbe/v1/blocks', parse: false } );
	const totalPages = Number( res.headers.get( 'x-wp-totalpages' ) );

	for ( let page = 1; page <= Math.max( totalPages, 1 ); page++ ) {
		const apiBlocks = await apiFetch( {
			path: addQueryArgs( '/bmfbe/v1/blocks', { page } ),
		} );
		registeredBlocks = [ ...registeredBlocks, ...apiBlocks ];
	}

	return registeredBlocks.map( ( block ) => pick( block, blockFields ) );
}

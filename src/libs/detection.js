const { pick } = lodash;
const { apiFetch, blocks, url } = wp;

const { addQueryArgs } = url;

/**
 * Get registered blocks.
 *
 * @return {Promise<[]>} List of registered blocks.
 */
async function getRegisteredBlocks() {
	let registeredBlocks = [];

	const res = await apiFetch( { path: '/bmfbe/v1/blocks', parse: false } );
	const totalPages = Number( res.headers.get( 'x-wp-totalpages' ) );

	for ( let page = 1; page <= Math.max( totalPages, 1 ); page++ ) {
		const apiBlocks = await apiFetch( {
			path: addQueryArgs( '/bmfbe/v1/blocks', { page } ),
		} );
		registeredBlocks = [ ...registeredBlocks, ...apiBlocks ];
	}

	return registeredBlocks;
}

/**
 * Get blocks used in editor.
 *
 * @return {[]} List of blocks used in editor.
 */
function getEditorBlocks() {
	return (
		blocks
			.getBlockTypes()
			// Remove blocks not visible in inserter.
			.filter(
				( block ) =>
					block.supports === undefined ||
					block.supports.inserter !== false
			)
			// Keep only necessary fields.
			.map( ( block ) =>
				pick( block, [
					'name',
					'title',
					'description',
					'category',
					'icon',
					'keywords',
					'supports',
					'styles',
					'variations',
				] )
			)
			// Normalize icons.
			.map( ( block ) => {
				if ( typeof block.icon.src === 'string' ) {
					block.icon = block.icon.src;
				} else if (
					typeof block.icon.src === 'object' &&
					typeof block.icon.src.type === 'function' &&
					block.icon.src.type.name === 'SVG'
				) {
					const shadow = document.createElement( 'div' );
					ReactDOM.render( block.icon.src, shadow );

					block.icon = shadow.getElementsByTagName(
						'svg'
					)[ 0 ].outerHTML;
				}

				return block;
			} )
	);
}

// eslint-disable-next-line space-before-function-paren
export default async () => {
	// console.log(blocks.getBlockTypes());

	const registeredBlocks = await getRegisteredBlocks();
	const editorBlocks = getEditorBlocks();

	// eslint-disable-next-line no-console
	console.log( registeredBlocks, editorBlocks );

	// TODO: detect new blocks, old blocks to update and to delete.

	// Redirect user to settings page.
	// window.location.href = bmfbeEditorGlobal.settingsPage;
};

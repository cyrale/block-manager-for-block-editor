const { isEqual, omit, pick } = lodash;
const { apiFetch, blocks, url } = wp;

const { addQueryArgs } = url;

const blockFields = [
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

	return registeredBlocks.map( ( block ) => pick( block, blockFields ) );
}

/**
 * Get blocks used in editor.
 *
 * @return {Array} List of blocks used in editor.
 */
function getEditorBlocks() {
	return (
		blocks
			.getBlockTypes()
			// Remove blocks not visible in inserter.
			.filter( ( block ) => block.supports?.inserter !== false )
			// Keep only necessary fields.
			.map( ( block ) => pick( block, blockFields ) )
			// Normalize icons.
			.map( ( block ) => {
				block.icon = normalizeIcon( block.icon );

				return block;
			} )
	);
}

function normalizeIcon( icon ) {
	if ( 'string' === typeof icon?.src ) {
		return icon.src;
	} else if (
		'object' === icon?.src &&
		'function' === typeof icon?.src.type &&
		'SVG' === icon?.src.type.name
	) {
		const shadow = document.createElement( 'div' );
		ReactDOM.render( icon?.src, shadow );

		return shadow.getElementsByTagName( 'svg' )[ 0 ].outerHTML;
	}

	return '';
}

function sanitizeSupports( block ) {
	const supports = block.supports ?? {};

	block.supports = {};

	Object.keys( supports ).forEach( ( prop ) => {
		block.supports[ prop ] = {
			value: supports[ prop ],
		};
	} );

	return block;
}

function sanitizeStyles( block ) {
	block.styles = ( block.styles ?? [] ).map( ( style ) =>
		pick( style, [ 'name', 'label', 'isDefault', 'isActive' ] )
	);

	return block;
}

function sanitizeVariations( block ) {
	block.variations = ( block.variations ?? [] ).map( ( variation ) => {
		variation = pick( variation, [
			'name',
			'title',
			'description',
			'icon',
			'isDefault',
			'isActive',
		] );
		variation.icon = normalizeIcon( variation.icon );

		return variation;
	} );

	return block;
}

function updateProperty( properties, editorProperties, fields ) {
	properties = properties
		// Remove properties that are not in editor.
		.filter(
			( prop ) =>
				undefined !==
				editorProperties.find( ( p ) => p.name === prop.name )
		)
		// Update value of properties.
		.map( ( prop ) => {
			const editorProp = editorProperties.find(
				( p ) => p.name === prop.name
			);

			if ( undefined !== editorProp ) {
				prop = Object.assign( {}, prop, pick( editorProp, fields ) );
			}

			return prop;
		} );
	// Add new properties.
	properties = [ ...properties, ...diff( editorProperties, properties ) ];

	return properties;
}

/**
 * Creates an array of array1 values not included in array2.
 *
 * @param {Array} array1 Source array.
 * @param {Array} array2 Values to exclude.
 * @return {Array} The new array of filtered values.
 */
function diff( array1, array2 ) {
	return array1.filter(
		( item1 ) =>
			array2.findIndex( ( item2 ) => item2.name === item1.name ) < 0
	);
}

/**
 * Creates an array of array1 values included in array2.
 *
 * @param {Array} array1 Source array.
 * @param {Array} array2 Values to include.
 * @return {Array} The new array of filtered values.
 */
function intersect( array1, array2 ) {
	return array1.filter(
		( item1 ) =>
			array2.findIndex( ( item2 ) => item2.name === item1.name ) >= 0
	);
}

// eslint-disable-next-line space-before-function-paren
export default async () => {
	const registeredBlocks = await getRegisteredBlocks();

	const editorBlocks = getEditorBlocks()
		.map( sanitizeSupports )
		.map( sanitizeStyles )
		.map( sanitizeVariations );

	// Extract new blocks.
	const newBlocks = diff( editorBlocks, registeredBlocks );

	// Send new blocks to API.
	for ( let i = 0; i < newBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks',
				method: 'POST',
				data: newBlocks[ i ],
			} );

			// TODO: update notifications.
		} catch ( e ) {
			// TODO: manage errors.
		}
	}

	// Extract blocks to update.
	// TODO: test if updated block is equal to block in editor, to improve performance.
	const updateBlocks = intersect( registeredBlocks, editorBlocks ).map(
		( block ) => {
			const editorBlock = editorBlocks.find(
				( b ) => b.name === block.name
			);
			const updateBlock = Object.assign( {}, block, editorBlock );

			// Supports.
			const supports = {};
			const editorSupports = editorBlock.supports ?? {};
			Object.keys( editorSupports ).forEach( ( prop ) => {
				if (
					false === block.supports[ prop ]?.isActive &&
					undefined !== editorBlock.supports[ prop ]?.value
				) {
					supports[ prop ] = {
						value: editorBlock.supports[ prop ].value,
					};
				}
			} );

			updateBlock.supports = supports;

			// Styles.
			const styles = block.styles ?? [];
			const editorStyles = editorBlock.styles ?? [];

			updateBlock.styles = updateProperty( styles, editorStyles, [
				'label',
			] );

			// Variations.
			const variations = block.variations ?? [];
			const editorVariations = editorBlock.variations ?? [];

			updateBlock.variations = updateProperty(
				variations,
				editorVariations,
				[ 'title', 'description', 'icon' ]
			);

			return updateBlock;
		}
	);

	// Send update to API.
	for ( let i = 0; i < updateBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks/' + updateBlocks[ i ].name,
				method: 'PATCH',
				data: omit( updateBlocks[ i ], 'name' ),
			} );

			// TODO: update notifications.
		} catch ( e ) {
			// TODO: manage errors.
		}
	}

	// Detect old blocks to delete.
	const deletedBlocks = diff( registeredBlocks, editorBlocks );

	// Send deletion to API.
	for ( let i = 0; i < deletedBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks/' + deletedBlocks[ i ].name,
				method: 'DELETE',
			} );

			// TODO: update notifications.
		} catch ( e ) {
			// TODO: manage errors.
		}
	}

	// console.log( oldBlocks, newBlocks, updateBlocks );

	// Redirect user to settings page.
	// window.location.href = bmfbeEditorGlobal.settingsPage;
};

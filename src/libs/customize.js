const { assign, merge, uniq } = lodash;
const {
	blocks,
	data: { select },
	domReady,
	hooks,
} = wp;

function searchBlock( name ) {
	return ( bmfbeEditorGlobal.blocks || [] ).find(
		( block ) => block.name === name
	);
}

function overrideVariations( editorVariations, blockVariations ) {
	return [ ...editorVariations ]
		.filter(
			( variation ) =>
				!! blockVariations.find(
					( v ) => v.name === variation.name && v.isActive
				)
		)
		.map( ( variation ) =>
			assign( {}, variation, {
				isDefault: !! blockVariations.find(
					( v ) => v.name === variation.name && v.isDefault
				),
			} )
		);
}

function getBlocksInContent( clientId = '' ) {
	const editorBlocks = select( 'core/block-editor' ).getBlocks( clientId );

	let blockNames = editorBlocks
		.filter( ( block ) => null !== block )
		.map( ( { name } ) => name );

	editorBlocks.forEach( ( { clientId: currentClientId } ) => {
		blockNames = uniq( [
			...blockNames,
			...getBlocksInContent( currentClientId ),
		] );
	} );

	return uniq( blockNames );
}

export default function customize() {
	domReady( () => {
		const blocksInContent = getBlocksInContent();

		// Remove disabled blocks.
		blocks.getBlockTypes().forEach( ( { name } ) => {
			const block = searchBlock( name );

			if (
				undefined !== block &&
				false === block?.enabled &&
				! blocksInContent.includes( name )
			) {
				blocks.unregisterBlockType( name );
			}
		} );
	} );

	hooks.addFilter(
		'blocks.registerBlockType',
		'bmfbe/supports/customize',
		( settings, name ) => {
			const block = searchBlock( name );

			if ( undefined === block ) {
				return settings;
			}

			// Remove disabled blocks from inserter.
			if ( false === block?.enabled ) {
				return merge( {}, settings, {
					supports: {
						inserter: false,
					},
				} );
			}

			// Customize supports.
			const overriddenSupports = {};
			if ( ! block.supports_override ) {
				Object.entries( block.supports ).forEach(
					( [ supportsName, supportsValue ] ) => {
						if ( supportsValue.isActive ) {
							overriddenSupports[ supportsName ] =
								supportsValue.value;
						}
					}
				);
			}

			// Customize styles.
			const overriddenStyles = overrideVariations(
				settings.styles || [],
				block.styles
			);

			// Customize variations.
			const overriddenVariations = overrideVariations(
				settings.variations || [],
				block.variations
			);

			return assign( {}, settings, {
				style: overriddenStyles,
				supports: assign( {}, settings.supports, overriddenSupports ),
				variations: overriddenVariations,
			} );
		}
	);
}

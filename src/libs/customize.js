const { assign } = lodash;
const { hooks } = wp;

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

export default function customize() {
	// Remove blocks
	// blocks.getBlockTypes().forEach( ( blockType ) => {
	// 	if ( blockType.name === 'core/paragraph' ) {
	// 		wp.blocks.unregisterBlockType( blockType.name );
	// 	}
	// } );

	hooks.addFilter(
		'blocks.registerBlockType',
		'bmfbe/supports/customize',
		( settings, name ) => {
			const block = searchBlock( name );

			if ( undefined === block ) {
				return settings;
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

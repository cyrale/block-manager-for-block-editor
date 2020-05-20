const { assign } = lodash;
const { blocks, data, domReady, hooks } = wp;

const editorBlocks = bmfbeEditorGlobal.blocks || [];

function searchBlock( name ) {
	return editorBlocks.find( ( block ) => block.name === name );
}

export default function customize() {
	// Remove blocks
	// blocks.getBlockTypes().forEach( ( blockType ) => {
	// 	if ( blockType.name === 'core/paragraph' ) {
	// 		wp.blocks.unregisterBlockType( blockType.name );
	// 	}
	// } );

	// Customize supports.
	hooks.addFilter(
		'blocks.registerBlockType',
		'bmfbe/supports/customize',
		( settings, name ) => {
			const block = searchBlock( name );

			if ( undefined === block || ! block.supports_override ) {
				return settings;
			}

			const supports = {};
			Object.entries( block.supports ).forEach(
				( [ supportsName, supportsValue ] ) => {
					if ( supportsValue.isActive ) {
						supports[ supportsName ] = supportsValue.value;
					}
				}
			);

			return assign( {}, settings, {
				supports: assign( {}, settings.supports, supports ),
			} );
		}
	);

	domReady( () => {
		// Customize styles.
		editorBlocks.forEach( ( block ) => {
			block.styles.forEach( ( style ) => {
				if ( ! style.isActive ) {
					// Deactivate styles.
					blocks.unregisterBlockStyle( block.name, style.name );
				} else if ( style.isDefault ) {
					// Set default style.
					data.dispatch(
						'core/edit-post'
					).updatePreferredStyleVariations( block.name, style.name );
				}
			} );
		} );
	} );
}

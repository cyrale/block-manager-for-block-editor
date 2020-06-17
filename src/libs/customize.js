/* global bmfbeEditorGlobal:false */

import { merge, uniq } from 'lodash';

import * as blocks from '@wordpress/blocks';
import { select } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import * as hooks from '@wordpress/hooks';

/**
 * Search block by name.
 *
 * @param {string} name Name of the block to find.
 *
 * @return {Object|undefined} Block with the given name, undefined otherwise.
 * @since 1.0.0
 */
function searchBlock( name ) {
	return ( bmfbeEditorGlobal.blocks ?? [] ).find(
		( block ) => block.name === name
	);
}

/**
 * Override variations values from editor with values from plugin.
 *
 * @param {Object[]} editorVariations Values from editor.
 * @param {Object[]} blockVariations Values from plugin.
 *
 * @return {Object[]} Overridden variations.
 * @since 1.0.0
 */
function overrideVariations( editorVariations, blockVariations ) {
	return [ ...editorVariations ]
		.filter(
			( variation ) =>
				!! blockVariations.find(
					( v ) => v.name === variation.name && v.isActive
				)
		)
		.map( ( variation ) =>
			merge( {}, variation, {
				isDefault: !! blockVariations.find(
					( v ) => v.name === variation.name && v.isDefault
				),
			} )
		);
}

/**
 * List all block names used in content.
 *
 * @param {string} [clientId=''] ID of a block. Leave it empty to get all blocks.
 *
 * @return {string[]} List of block names.
 * @since 1.0.0
 */
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

/**
 * Customize blocks with parameters from plugin.
 *
 * @since 1.0.0
 */
export default function customize() {
	domReady( () => {
		const blocksInContent = getBlocksInContent();

		// Remove disabled blocks.
		blocks.getBlockTypes().forEach( ( { name } ) => {
			const block = searchBlock( name );

			if (
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
		( settings, blockName ) => {
			const block = searchBlock( blockName );

			if ( undefined === block ) {
				return settings;
			}

			// Remove disabled blocks from inserter. (Safe alternative to `unregisterBlockType`)
			if ( false === block?.enabled ) {
				return merge( {}, settings, {
					supports: {
						inserter: false,
					},
				} );
			}

			// Customize supports.
			const overriddenSupports = {};
			if ( block.supports_override ) {
				Object.entries( block.supports ).forEach(
					( [ name, { isActive, value } ] ) => {
						if ( isActive ) {
							overriddenSupports[ name ] = value;
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

			return merge( {}, settings, {
				style: overriddenStyles,
				supports: merge( {}, settings.supports, overriddenSupports ),
				variations: overriddenVariations,
			} );
		}
	);
}

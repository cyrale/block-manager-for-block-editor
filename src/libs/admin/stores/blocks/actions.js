/**
 * External dependencies
 */
import { pick } from 'lodash';

/**
 * WordPress dependencies
 */
import { getBlockTypes } from '@wordpress/blocks';

// TODO; get this values from global variable.
const supports = [
	'align',
	'alignWide',
	'defaultStylePicker',
	'anchor',
	'customClassName',
	'className',
	'html',
	'inserter',
	'multiple',
	'reusable',
];

export { fetchAllCategoriesFromAPI, fetchAllFromAPI } from '../actions';

export function getEditorBlocks() {
	// TODO: move this to reducer
	return (
		getBlockTypes() // Remove blocks not visible in inserter.
			.filter( ( block ) => block.supports?.inserter !== false )
			// Keep only necessary fields.
			.map( ( block ) =>
				pick( block, [
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
				] )
			)
			// Sanitize values.
			.map( ( block ) => {
				// Sanitize supports.
				block.supports = block.supports ?? {};

				Object.keys( block.supports ).forEach( ( name ) => {
					if ( ! supports.includes( name ) ) {
						delete block.supports[ name ];
					} else {
						block.supports[ name ] = {
							value: block.supports[ name ],
						};
					}
				} );

				// Sanitize styles and variations.
				[ 'styles', 'variations' ].forEach( ( key ) => {
					block[ key ] = ( block[ key ] ?? [] ).map( ( v ) =>
						pick( v, [ 'name', 'isDefault', 'isActive' ] )
					);
				} );

				return block;
			} )
	);
}

export function initBlockCategories( categories ) {
	return {
		type: 'INIT_BLOCK_CATEGORIES',
		categories,
	};
}

export function initBlocks( blocks ) {
	return {
		type: 'INIT_BLOCKS',
		blocks,
	};
}

export function createBlocks( blocks ) {
	return {
		type: 'CREATE_BLOCKS',
		blocks,
	};
}

export function updateBlocks( blocks ) {
	return {
		type: 'UPDATE_BLOCKS',
		blocks,
	};
}

export function deleteBlocks( blocks ) {
	return {
		type: 'DELETE_BLOCKS',
		blocks,
	};
}

export function updateBlock( name, value ) {
	return {
		type: 'UPDATE_BLOCK',
		name,
		value,
	};
}

export function* saveBlock( block ) {
	yield {
		type: 'SAVE_BLOCK_START',
		block,
	};

	const savedBlock = yield {
		type: 'SAVE_BLOCK',
		block,
	};

	yield updateBlock( savedBlock.name, savedBlock );

	yield {
		type: 'SAVE_BLOCK_FINISH',
		block,
	};

	return savedBlock;
}

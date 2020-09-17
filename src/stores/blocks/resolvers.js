/**
 * External dependencies
 */
import { isEqual, mapValues, merge, pick, pickBy } from 'lodash';

/**
 * Internal dependencies
 */
import { getEditorBlocks } from '../../api/blocks';
import * as actions from './actions';

export * from '../common/collection/resolvers';

export function* getCollection() {
	function findElementByName( elements, name ) {
		return elements.find( ( el ) => el.name === name );
	}

	const blockFields = [
		'name',
		'category',
		'supports',
		'styles',
		'variations',
	];

	const registeredBlocks = yield actions.fetchAllFromAPI();
	const editorBlocks = getEditorBlocks();

	// Extract names.
	const registeredBlockNames = registeredBlocks.map( ( { name } ) => name );
	const editorBlockNames = editorBlocks.map( ( { name } ) => name );

	let updatedBlockData = [];

	// Create new blocks.
	const newBlockNames = editorBlockNames.filter(
		( name ) => ! registeredBlockNames.includes( name )
	);
	const newBlocks = newBlockNames.map( ( name ) =>
		pick( findElementByName( editorBlocks, name ), blockFields )
	);

	if ( newBlocks.length ) {
		updatedBlockData = [
			...updatedBlockData,
			...( yield actions.createItems( newBlocks ) ),
		];
	}

	// Update existing blocks.
	function exportBlockData( name ) {
		const editor = {};
		const registered = {};

		const editorBlock = findElementByName( editorBlocks, name );
		const registeredBlock = findElementByName( registeredBlocks, name );

		const filterObject = ( obj, predicate ) => {
			return Object.keys( obj ).reduce( ( ret, k ) => {
				if ( predicate( obj[ k ], k ) ) {
					ret[ k ] = obj[ k ];
				}

				return ret;
			}, {} );
		};

		const filterFields = ( prop ) => {
			return pickBy(
				prop,
				( v, i ) => 'name' === i || ( 'isDefault' === i && true === v )
			);
		};

		editor.category = editorBlock.category;
		registered.category = registeredBlock.category;

		// Extract supports.
		editor.supports = filterObject(
			editorBlock.supports,
			( v, k ) =>
				registeredBlock.supports[ k ] &&
				! registeredBlock.supports[ k ].isActive
		);
		registered.supports = mapValues(
			filterObject( registeredBlock.supports, ( v, k ) =>
				Object.keys( editor.supports ).includes( k )
			),
			( v ) => pick( v, [ 'value' ] )
		);

		// Extract styles.
		editor.styles = editorBlock.styles.map( filterFields );
		registered.styles = registeredBlock.styles.map( filterFields );

		// Extract supports.
		editor.variations = editorBlock.variations.map( filterFields );
		registered.variations = registeredBlock.variations.map( filterFields );

		return {
			editor,
			registered,
		};
	}

	const updatedBlockNames = registeredBlockNames
		.filter( ( name ) => editorBlockNames.includes( name ) )
		.filter( ( name ) => {
			const {
				editor: editorBlock,
				registered: registeredBlock,
			} = exportBlockData( name );

			return (
				editorBlock.category !== registeredBlock.category ||
				! isEqual( editorBlock.supports, registeredBlock.supports ) ||
				! isEqual( editorBlock.styles, registeredBlock.styles ) ||
				! isEqual( editorBlock.variations, registeredBlock.variations )
			);
		} );
	const updatedBlocks = updatedBlockNames.map( ( name ) => {
		const {
			editor: editorBlock,
			registered: registeredBlock,
		} = exportBlockData( name );

		const block = {
			name,
			keep: {
				styles: false,
				variations: false,
			},
		};

		[ 'category', 'supports', 'styles', 'variations' ].forEach( ( key ) => {
			if ( ! isEqual( editorBlock[ key ], registeredBlock[ key ] ) ) {
				block[ key ] = editorBlock[ key ];
			}
		} );

		return block;
	} );

	if ( updatedBlocks.length ) {
		updatedBlockData = [
			...updatedBlockData,
			...( yield actions.updateItems( updatedBlocks ) ),
		];
	}

	// Delete old blocks.
	const deletedBlockNames = registeredBlockNames.filter(
		( name ) => ! editorBlockNames.includes( name )
	);

	if ( deletedBlockNames.length ) {
		yield actions.deleteItems( deletedBlockNames );
	}

	// Get updated values to display.
	const resultBlocks = editorBlocks.map( ( block ) => {
		const informationFields = [
			'title',
			'description',
			'icon',
			'keywords',
		];

		const updatedData = findElementByName( updatedBlockData, block.name );
		if ( undefined !== updatedData ) {
			return merge( updatedData, pick( block, informationFields ) );
		}

		const registeredBlock = findElementByName(
			registeredBlocks,
			block.name
		);
		return merge( registeredBlock, pick( block, informationFields ) );
	} );

	return actions.initCollection( resultBlocks );
}

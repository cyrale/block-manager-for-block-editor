/* global bmfbeEditorGlobal:false */

import {
	assign,
	cloneDeep,
	differenceBy,
	forEach,
	filter,
	intersection,
	intersectionBy,
	isEqual,
	mapValues,
	omit,
	pick,
	reduce,
} from 'lodash';

import * as blocks from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { renderToString } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import * as apiBlocks from './admin/api/blocks';

/**
 * Values to follow progress of detect.
 *
 * @type {{deleted: {total: number, progress: number}, newOnes: {total: number, progress: number}, updated: {total: number, progress: number}}}
 * @since 1.0.0
 */
const noticeValues = {
	newOnes: {
		progress: 0,
		total: 0,
	},
	updated: {
		progress: 0,
		total: 0,
	},
	deleted: {
		progress: 0,
		total: 0,
	},
};

/**
 * Get blocks used in editor.
 *
 * @return {Array} List of blocks used in editor.
 * @since 1.0.0
 */
function getEditorBlocks() {
	return (
		blocks
			.getBlockTypes()
			// Remove blocks not visible in inserter.
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
			// Normalize icons.
			.map( ( block ) => {
				block.icon = normalizeIcon( block.icon );

				return block;
			} )
	);
}

/**
 * Find an object element with its name.
 *
 * @param {Object[]} elements List of elements.
 * @param {string} name Name of the element to search for.
 *
 * @return {Object|undefined} Searched element, undefined if not found.
 * @since 1.0.0
 */
function findElementByName( elements, name ) {
	return elements.find( ( el ) => el.name === name );
}

/**
 * Convert SVG icon to string. If icon is already a string (dashicon), this string is kept.
 *
 * @param {Object} icon Icon object to convert.
 *
 * @return {string} Converted icon.
 * @since 1.0.0
 */
function normalizeIcon( icon ) {
	if ( 'string' === typeof icon?.src ) {
		return icon.src;
	} else if (
		'object' === typeof icon?.src &&
		'function' === typeof icon?.src.type &&
		'SVG' === icon?.src.type.name
	) {
		return renderToString( icon.src );
	}

	return '';
}

/**
 * Sanitize supports in block.
 *
 * @param {Object} block Block with supports to sanitized.
 *
 * @return {Object} Block with sanitized supports.
 * @since 1.0.0
 */
function sanitizeSupports( block ) {
	block.supports = mapValues( block.supports ?? {}, ( value ) => ( {
		value,
	} ) );

	return block;
}

/**
 * Sanitize styles in block.
 *
 * @param {Object} block Block with styles to sanitized.
 *
 * @return {Object} Block with sanitized styles.
 * @since 1.0.0
 */
function sanitizeStyles( block ) {
	block.styles = ( block.styles ?? [] ).map( ( style ) =>
		pick( style, [ 'name', 'label', 'isDefault', 'isActive' ] )
	);

	return block;
}

/**
 * Sanitize variations in block.
 *
 * @param {Object} block Block with variations to sanitized.
 *
 * @return {Object} Block with sanitized variations.
 * @since 1.0.0
 */
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

/**
 * Update saved properties with values in editor.
 *
 * @param {Array<{}>} properties Properties to update.
 * @param {Array<{}>} editorProperties properties from the editor.
 * @param {string[]} fields List of fields to update for each property.
 *
 * @return {Array<{}>} Updated properties.
 * @since 1.0.0
 */
function updateProperty( properties, editorProperties, fields ) {
	properties = properties
		// Remove properties that are not in editor.
		.filter(
			( prop ) =>
				undefined !== findElementByName( editorProperties, prop.name )
		)
		// Update value of properties.
		.map( ( prop ) => {
			const editorProp = findElementByName( editorProperties, prop.name );

			if ( undefined !== editorProp ) {
				prop = assign( {}, prop, pick( editorProp, fields ) );
			}

			return prop;
		} );

	// Add new properties.
	properties = [
		...properties,
		...differenceBy( editorProperties, properties, 'name' ),
	];

	return properties;
}

/**
 * Remove unnecessary fields from properties to compare values between database and editor.
 *
 * @param {Object} prop Property with unnecessary fields to remove.
 *
 * @return {Object} Property with less fields.
 * @since 1.0.0
 */
function removeUnnecessaryFields( prop ) {
	prop = omit( prop, [ 'isActive' ] );
	if ( false === prop.isDefault ) {
		prop = omit( prop, [ 'isDefault' ] );
	}

	return prop;
}

/**
 * Display and refresh information to show progress to the user.
 *
 * @param {string} message Message to display instead of percentage.
 *
 * @since 1.0.0
 */
function refreshInfoNotice( message = '' ) {
	// translators: %s: Percentage of progression.
	const noticeStr = __( 'Detection in progress… %s', 'bmfbe' );
	const noticeDetails = {
		newOnes: '',
		updated: '',
		deleted: '',
	};

	// Calculate progress in percent if message is empty.
	if ( message === '' ) {
		const progress = reduce(
			noticeValues,
			( acc, value ) => ( {
				count: acc.count + value.progress,
				total: acc.total + value.total,
			} ),
			{ count: 0, total: 0 }
		);
		const progressPercent =
			0 === progress.total
				? 0
				: 100 * ( progress.count / progress.total );

		message = progressPercent.toFixed( 1 ) + '%';
	}

	// Progress of sending new blocks.
	if ( noticeValues.newOnes.total > 0 ) {
		noticeDetails.newOnes = sprintf(
			// translators: %1$d: count of new blocks, %2$d: total of new blocks.
			__( 'new %1$d/%2$d', 'bmfbe' ),
			noticeValues.newOnes.progress,
			noticeValues.newOnes.total
		);
	}

	// Progress of sending updated blocks.
	if ( noticeValues.updated.total > 0 ) {
		noticeDetails.updated = sprintf(
			// translators: %1$d: count of updated blocks, %2$d: total of updated blocks.
			__( 'updated %1$d/%2$d', 'bmfbe' ),
			noticeValues.updated.progress,
			noticeValues.updated.total
		);
	}

	// Progress of sending deleted blocks.
	if ( noticeValues.deleted.total > 0 ) {
		noticeDetails.deleted = sprintf(
			// translators: %1$d: count of deleted blocks, %2$d: total of deleted blocks.
			__( 'deleted %1$d/%2$d', 'bmfbe' ),
			noticeValues.deleted.progress,
			noticeValues.deleted.total
		);
	}

	// Concatenate progress values to display them.
	const details = filter( noticeDetails, ( str ) => str !== '' ).join( ', ' );

	// Display and refresh progress message.
	dispatch( 'core/notices' ).createInfoNotice(
		sprintf( noticeStr, message ) +
			( details !== '' ? ' (' + details + ')' : '' ),
		{ isDismissible: false, id: 'bmfbeDetectionMode' }
	);
}

/**
 * Detect and insert/update/delete blocks in API for plugin usage.
 *
 * @since 1.0.0
 */
export default async function detect() {
	refreshInfoNotice();

	// Get blocks from database.
	const registeredBlocks = await apiBlocks.allBlocks();

	// Get block from editor and sanitize values.
	const editorBlocks = getEditorBlocks()
		.map( sanitizeSupports )
		.map( sanitizeStyles )
		.map( sanitizeVariations );

	// Detect new blocks.
	const newBlocks = differenceBy( editorBlocks, registeredBlocks, 'name' );

	if ( newBlocks.length > 0 ) {
		noticeValues.newOnes.total = newBlocks.length;
		refreshInfoNotice();
	}

	// Extract blocks to update.
	const updatedBlocks = intersectionBy(
		registeredBlocks,
		editorBlocks,
		'name'
	)
		.filter( ( block ) => {
			const clonedBlock = cloneDeep( block );
			const clonedEditorBlock = cloneDeep(
				findElementByName( editorBlocks, block.name )
			);

			// Remove private unsupported supports.
			const editorSupports = {};
			intersection(
				Object.keys( clonedEditorBlock.supports ?? {} ),
				Object.keys( clonedBlock.supports )
			).forEach( ( prop ) => {
				editorSupports[ prop ] = clonedEditorBlock.supports[ prop ];
			} );

			clonedEditorBlock.supports = editorSupports;

			// Remove supports not present in editor.
			const supports = {};
			intersection(
				Object.keys( clonedEditorBlock.supports ?? {} ),
				Object.keys( clonedBlock.supports )
			).forEach( ( prop ) => {
				supports[ prop ] = pick( clonedBlock.supports[ prop ], [
					'value',
				] );
			} );

			clonedBlock.supports = supports;

			// Remove unnecessary fields in styles.
			clonedBlock.styles = clonedBlock.styles.map(
				removeUnnecessaryFields
			);

			// Remove unnecessary fields in variations.
			clonedBlock.variations = clonedBlock.variations.map(
				removeUnnecessaryFields
			);

			return ! isEqual( clonedBlock, clonedEditorBlock );
		} )
		.map( ( block ) => {
			const editorBlock = findElementByName( editorBlocks, block.name );
			const updateBlock = assign( {}, block, editorBlock );

			// Update inactive supports.
			const supports = {};
			forEach( editorBlock.supports ?? {}, ( support, prop ) => {
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

			// Update styles.
			const styles = block.styles ?? [];
			const editorStyles = editorBlock.styles ?? [];

			updateBlock.styles = updateProperty( styles, editorStyles, [
				'label',
			] );

			// Update variations.
			const variations = block.variations ?? [];
			const editorVariations = editorBlock.variations ?? [];

			updateBlock.variations = updateProperty(
				variations,
				editorVariations,
				[ 'title', 'description', 'icon' ]
			);

			return updateBlock;
		} );

	if ( updatedBlocks.length > 0 ) {
		noticeValues.updated.total = updatedBlocks.length;
		refreshInfoNotice();
	}

	// Detect old blocks to delete.
	const deletedBlocks = differenceBy(
		registeredBlocks,
		editorBlocks,
		'name'
	);

	if ( deletedBlocks.length > 0 ) {
		noticeValues.deleted.total = deletedBlocks.length;
		refreshInfoNotice();
	}

	// Send new blocks to API.
	for ( let i = 0; i < newBlocks.length; i++ ) {
		await apiBlocks.createBlock( newBlocks[ i ] );

		noticeValues.newOnes.progress++;
		refreshInfoNotice();
	}

	// Send update to API.
	for ( let i = 0; i < updatedBlocks.length; i++ ) {
		await apiBlocks.updateBlock( {
			...updatedBlocks[ i ],
			...{
				keep: {
					styles: false,
					variations: false,
				},
			},
		} );

		noticeValues.updated.progress++;
		refreshInfoNotice();
	}

	// Send deletion to API.
	for ( let i = 0; i < deletedBlocks.length; i++ ) {
		await apiBlocks.deleteBlock( deletedBlocks[ i ].name );

		noticeValues.deleted.progress++;
		refreshInfoNotice();
	}

	refreshInfoNotice( __( 'Complete!', 'bmfbe' ) );

	// Redirect user to settings page.
	window.location.href = bmfbeEditorGlobal.settingsPage;
}

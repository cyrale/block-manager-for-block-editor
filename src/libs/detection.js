import { blockFields, getRegisteredBlocks } from './registered-blocks';

const { cloneDeep, isEqual, omit, pick } = lodash;
const {
	apiFetch,
	blocks,
	data,
	i18n: { __, sprintf },
} = wp;

/**
 * Values to follow progress of detection.
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
			.map( ( block ) => pick( block, blockFields ) )
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

/**
 * Sanitize supports in block.
 *
 * @param {Object} block Block with supports to sanitized.
 *
 * @return {Object} Block with sanitized supports.
 * @since 1.0.0
 */
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
				prop = Object.assign( {}, prop, pick( editorProp, fields ) );
			}

			return prop;
		} );

	// Add new properties.
	properties = [ ...properties, ...diff( editorProperties, properties ) ];

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
	const noticeStr = __( 'Detection in progress... %s', 'bmfbe' );
	const noticeDetails = {
		newOnes: '',
		updated: '',
		deleted: '',
	};

	// Calculate progress in percent if message is empty.
	if ( message === '' ) {
		const progress = Object.values( noticeValues ).reduce(
			( acc, value ) => acc + value.progress,
			0
		);
		const total = Object.values( noticeValues ).reduce(
			( acc, value ) => acc + value.total,
			0
		);
		const progressPercent = total === 0 ? 0 : 100 * ( progress / total );

		message = progressPercent.toFixed( 1 ) + '%';
	}

	// Progress of sending new blocks.
	if ( noticeValues.newOnes.total > 0 ) {
		noticeDetails.newOnes = sprintf(
			__( 'new %1$d/%2$d', 'bmfbe' ),
			noticeValues.newOnes.progress,
			noticeValues.newOnes.total
		);
	}

	// Progress of sending updated blocks.
	if ( noticeValues.updated.total > 0 ) {
		noticeDetails.updated = sprintf(
			__( 'updated %1$d/%2$d', 'bmfbe' ),
			noticeValues.updated.progress,
			noticeValues.updated.total
		);
	}

	// Progress of sending deleted blocks.
	if ( noticeValues.deleted.total > 0 ) {
		noticeDetails.deleted = sprintf(
			__( 'deleted %1$d/%2$d', 'bmfbe' ),
			noticeValues.deleted.progress,
			noticeValues.deleted.total
		);
	}

	// Concatenate progress values to display them.
	const details = Object.values( noticeDetails )
		.filter( ( str ) => str !== '' )
		.join( ', ' );

	// Display and refresh progress message.
	data.dispatch( 'core/notices' ).createInfoNotice(
		sprintf( noticeStr, message ) +
			( details !== '' ? ' (' + details + ')' : '' ),
		{ isDismissible: false, id: 'bmfbeDetectionMode' }
	);
}

/**
 * Creates an array of array1 values not included in array2.
 *
 * @param {Array} array1 Source array.
 * @param {Array} array2 Values to exclude.
 *
 * @return {Array} The new array of filtered values.
 * @since 1.0.0
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
 *
 * @return {Array} The new array of filtered values.
 * @since 1.0.0
 */
function intersect( array1, array2 ) {
	return array1.filter(
		( item1 ) =>
			array2.findIndex( ( item2 ) => item2.name === item1.name ) >= 0
	);
}

export default async () => {
	refreshInfoNotice();

	// Get blocks from database.
	const registeredBlocks = await getRegisteredBlocks();

	// Get block from editor and sanitize values.
	const editorBlocks = getEditorBlocks()
		.map( sanitizeSupports )
		.map( sanitizeStyles )
		.map( sanitizeVariations );

	// Detect new blocks.
	const newBlocks = diff( editorBlocks, registeredBlocks );

	if ( newBlocks.length > 0 ) {
		noticeValues.newOnes.total = newBlocks.length;
		refreshInfoNotice();
	}

	// Extract blocks to update.
	const updatedBlocks = intersect( registeredBlocks, editorBlocks )
		.filter( ( block ) => {
			const clonedBlock = cloneDeep( block );
			const clonedEditorBlock = cloneDeep(
				findElementByName( editorBlocks, block.name )
			);

			// Remove private unsupported supports.
			const editorSupports = {};
			Object.keys( clonedEditorBlock.supports ?? {} ).forEach(
				( prop ) => {
					if (
						Object.keys( clonedBlock.supports ).includes( prop )
					) {
						editorSupports[ prop ] =
							clonedEditorBlock.supports[ prop ];
					}
				}
			);

			clonedEditorBlock.supports = editorSupports;

			// Remove supports not present in editor.
			const supports = {};
			Object.keys( clonedBlock.supports ).forEach( ( prop ) => {
				if (
					Object.keys( clonedEditorBlock.supports ).includes( prop )
				) {
					supports[ prop ] = pick( clonedBlock.supports[ prop ], [
						'value',
					] );
				}
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
			const updateBlock = Object.assign( {}, block, editorBlock );

			// Update inactive supports.
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
	const deletedBlocks = diff( registeredBlocks, editorBlocks );

	if ( deletedBlocks.length > 0 ) {
		noticeValues.deleted.total = deletedBlocks.length;
		refreshInfoNotice();
	}

	// Send new blocks to API.
	for ( let i = 0; i < newBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks',
				method: 'POST',
				data: newBlocks[ i ],
			} );
		} catch ( e ) {
			// TODO: manage errors.
		}

		noticeValues.newOnes.progress++;
		refreshInfoNotice();
	}

	// Send update to API.
	for ( let i = 0; i < updatedBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks/' + updatedBlocks[ i ].name,
				method: 'PATCH',
				data: Object.assign( omit( updatedBlocks[ i ], 'name' ), {
					keep: {
						styles: false,
						variations: false,
					},
				} ),
			} );
		} catch ( e ) {
			// TODO: manage errors.
		}

		noticeValues.updated.progress++;
		refreshInfoNotice();
	}

	// Send deletion to API.
	for ( let i = 0; i < deletedBlocks.length; i++ ) {
		try {
			await apiFetch( {
				path: '/bmfbe/v1/blocks/' + deletedBlocks[ i ].name,
				method: 'DELETE',
			} );
		} catch ( e ) {
			// TODO: manage errors.
		}

		noticeValues.deleted.progress++;
		refreshInfoNotice();
	}

	refreshInfoNotice( __( 'Complete!', 'bmfbe' ) );

	// Redirect user to settings page.
	window.location.href = bmfbeEditorGlobal.settingsPage;
};

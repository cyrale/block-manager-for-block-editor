/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Description from '../description';
import IndeterminateToggleControl from '../indeterminate-toggle-control';

export default function Pattern( {
	description,
	disabled: patternDisabled = false,
	name,
	title,
} ) {
	/**
	 * Handle changes on pattern disabled.
	 *
	 * @param {boolean} disabled TRUE if patter is disabled.
	 * @since 1.0.0
	 */
	async function handleDisabledChange( disabled ) {
		console.log( disabled ); // eslint-disable-line no-console
		// await updateBlock( blockName, value );
		// const newBlock = wpSelect( BLOCKS_STORE ).getBlock( blockName );
		// enqueueChanges( pick( newBlock, changingFields ) );
	}

	return (
		<div className="bmfbe-pattern">
			{ /* <StatusIcon status={ status } /> */ }
			<div className="bmfbe-pattern__content">
				<Description
					classPrefix="pattern"
					name={ name }
					title={ title }
					description={ description }
				/>
			</div>
			<IndeterminateToggleControl
				label={ __( 'Disable pattern', 'bmfbe' ) }
				className="bmfbe-pattern__disable"
				checked={ patternDisabled }
				onChange={ ( { checked } ) => handleDisabledChange( checked ) }
			/>
		</div>
	);
}

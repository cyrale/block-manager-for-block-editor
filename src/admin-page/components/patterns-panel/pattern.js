/**
 * WordPress dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { COLLECTION_STORE as PATTERNS_STORE } from '../../../stores/patterns/constants';
import Description from '../description';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import StatusIcon from '../status-icon';

export default function Pattern( { name } ) {
	const { pattern, status } = useSelect( ( select ) => ( {
		pattern: select( PATTERNS_STORE ).getItem( name ),
		status: select( PATTERNS_STORE ).getStatus( name ),
	} ) );

	const { updateItem } = useDispatch( PATTERNS_STORE );

	/**
	 * Handle changes on pattern disabled.
	 *
	 * @param {boolean} enabled True if pattern is disabled.
	 * @since 1.0.0
	 */
	async function handleDisabledChange( enabled ) {
		updateItem( name, { disabled: ! enabled } );
	}

	return (
		<div className="bmfbe-pattern">
			<StatusIcon status={ status } />
			<div className="bmfbe-pattern__content">
				<Description
					classPrefix="pattern"
					name={ name }
					title={ pattern.title }
					description={ pattern.description }
				/>
			</div>
			<IndeterminateToggleControl
				label={ __( 'Enable this pattern', 'bmfbe' ) }
				className="bmfbe-pattern__disable"
				checked={ ! pattern.disabled }
				onChange={ ( { checked } ) => handleDisabledChange( checked ) }
			/>
		</div>
	);
}

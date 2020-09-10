/**
 * External dependencies
 */
import { pick } from 'lodash';

/**
 * WordPress dependencies.
 */
import { select as wpSelect, useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { PATTERNS_STORE } from '../../../stores/patterns/constants';
import Description from '../description';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import StatusIcon from '../status-icon';
import useDelayedChanges from '../../../hooks/use-delayed-changes';

/**
 * List of all fields of a pattern that can be modified.
 *
 * @constant {string[]}
 * @since 1.0.0
 */
const changingFields = [ 'name', 'disabled' ];

export default function Pattern( { name } ) {
	const { pattern, status } = useSelect( ( select ) => ( {
		pattern: select( PATTERNS_STORE ).getPattern( name ),
		status: select( PATTERNS_STORE ).getStatus( name ),
	} ) );

	const { savePattern, updatePattern } = useDispatch( PATTERNS_STORE );
	const { enqueueChanges, setInitialData } = useDelayedChanges( savePattern );

	useEffect( () => {
		setInitialData( pick( pattern, changingFields ) );
	}, [] );

	/**
	 * Handle changes on pattern disabled.
	 *
	 * @param {boolean} enabled True if pattern is disabled.
	 * @since 1.0.0
	 */
	async function handleDisabledChange( enabled ) {
		await updatePattern( name, { disabled: ! enabled } );

		const newPattern = wpSelect( PATTERNS_STORE ).getPattern( name );
		enqueueChanges( pick( newPattern, changingFields ) );
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

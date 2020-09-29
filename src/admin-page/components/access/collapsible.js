/**
 * External dependencies
 */
import classnames from 'classnames';
import { mapValues, noop, uniq } from 'lodash';

/**
 * WordPress dependencies.
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { ITEM_STORE as SETTINGS_STORE } from '../../../stores/settings/constants';
import { CollapsibleFake, CollapsibleItem } from '../collapsible';
import IndeterminateToggleControl from '../indeterminate-toggle-control';

export default function Collapsible( {
	children,
	className,
	itemAccess = {},
	label = '',
	onChange = noop,
} ) {
	const { settings } = useSelect(
		( select ) => ( {
			settings: select( SETTINGS_STORE ).getItem(),
		} ),
		[]
	);

	/**
	 * Handle changes with global checkbox for access panel.
	 *
	 * @param {boolean} value New access value for all properties.
	 * @since 1.0.0
	 */
	function handleOnGlobalAccessChange( value ) {
		const newAccess = mapValues( itemAccess, ( postTypeValues ) =>
			mapValues( postTypeValues, () => value )
		);

		onChange( newAccess );
	}

	// Get uniquely values for access panel.
	const uniqFlatValues = uniq(
		Object.values(
			mapValues( itemAccess, ( postTypeValues ) =>
				Object.values( postTypeValues )
			)
		).reduce( ( acc, values ) => [ ...acc, ...values ], [] )
	);

	// Display access panel or fake it?
	const displayGlobalActivation =
		! settings.limit_access_by_section &&
		! settings.limit_access_by_user_group;
	// Split value to be used by checkbox.
	const globalActivation = {
		checked: 1 === uniqFlatValues.length && uniqFlatValues[ 0 ],
		indeterminate: 1 < uniqFlatValues.length,
	};

	const trigger = (
		<>
			<IndeterminateToggleControl
				onChange={ ( { checked } ) =>
					handleOnGlobalAccessChange( checked )
				}
				{ ...globalActivation }
			/>
			{ label }
		</>
	);

	if ( displayGlobalActivation ) {
		return (
			<CollapsibleFake
				className={ classnames( className ) }
				trigger={ trigger }
			/>
		);
	}

	return (
		<CollapsibleItem
			className={ classnames( className ) }
			trigger={ trigger }
		>
			{ children }
		</CollapsibleItem>
	);
}

/**
 * External dependencies
 */
import { assign, mapValues, merge, noop } from 'lodash';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IndeterminateToggleControl from '../indeterminate-toggle-control';

export default function Styles( { className, onChange = noop, value } ) {
	const wrapperClasses = className ?? 'bmfbe-block__styles';

	/**
	 * Handle changes on styles.
	 *
	 * @param {string} index Name of the style.
	 * @param {Object.<string, boolean>} change Change on the style.
	 *
	 * @since 1.0.0
	 */
	function handleOnChange( index, change ) {
		const newValue = merge( {}, value );

		newValue[ index ] = assign( newValue[ index ], change );

		onChange( newValue );
	}

	/**
	 * Handle changes on default values.
	 *
	 * @param {string} index Name of the style.
	 * @param {boolean} isDefault Default value.
	 *
	 * @since 1.0.0
	 */
	function handleOnDefaultChange( index, isDefault ) {
		let newValue = merge( {}, value );

		// Set all default values to false, keep only one.
		if ( isDefault ) {
			newValue = mapValues( value, ( v ) =>
				assign( v, {
					isDefault: false,
				} )
			);
		}

		newValue[ index ] = assign( newValue[ index ], { isDefault } );

		onChange( newValue );
	}

	return (
		<div className={ className }>
			{ value.map( ( style, index ) => {
				return (
					<div
						key={ style.name }
						className={ `${ wrapperClasses }-row` }
					>
						<IndeterminateToggleControl
							label={
								<>
									{ style.label } <em>{ style.name }</em>
								</>
							}
							checked={ style.isActive }
							onChange={ ( { checked } ) =>
								handleOnChange( index, { isActive: checked } )
							}
						/>
						<IndeterminateToggleControl
							label={ __( 'Default', 'bmfbe' ) }
							checked={ style.isDefault }
							disabled={ ! style.isActive }
							onChange={ ( { checked } ) =>
								handleOnDefaultChange( index, checked )
							}
						/>
					</div>
				);
			} ) }
		</div>
	);
}

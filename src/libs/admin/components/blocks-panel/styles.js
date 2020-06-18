/**
 * External dependencies
 */
import { merge, noop } from 'lodash';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IndeterminateToggleControl from '../indeterminate-toggle-control';

export default function Styles( { className, onChange = noop, value } ) {
	const wrapperClasses = className ? className : 'bmfbe-block__styles';

	/**
	 * Handle changes on styles.
	 *
	 * @param {string} index Name of the style.
	 * @param {Object.<string, boolean>} change Change on the style.
	 * @since 1.0.0
	 */
	function handleOnChange( index, change ) {
		value[ index ] = merge( {}, value[ index ], change );
		onChange( value );
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
								handleOnChange( index, { isDefault: checked } )
							}
						/>
					</div>
				);
			} ) }
		</div>
	);
}

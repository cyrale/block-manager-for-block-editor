/**
 * External dependencies
 */
import classnames from 'classnames';
import { map, merge, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IndeterminateToggleControl from './indeterminate-toggle-control';

/**
 * List of values for supports that are not boolean.
 *
 * @constant {*}
 * @since 1.0.0
 */
const supportsValues = {
	align: [
		{
			label: __( 'Disable', 'bmfbe' ),
			value: false,
		},
		{
			label: __( 'Enable', 'bmfbe' ),
			value: true,
		},
		{
			label: __( 'Left', 'bmfbe' ),
			value: 'left',
		},
		{
			label: __( 'Center', 'bmfbe' ),
			value: 'center',
		},
		{
			label: __( 'Right', 'bmfbe' ),
			value: 'right',
		},
		{
			label: __( 'Wide', 'bmfbe' ),
			value: 'wide',
		},
		{
			label: __( 'Full', 'bmfbe' ),
			value: 'full',
		},
	],
};

export default function Supports( {
	disabled = false,
	onChange = noop,
	value = {},
} ) {
	/**
	 * Handle changes on align supports.
	 *
	 * @param {boolean|string[]} align New align values.
	 * @since 1.0.0
	 */
	function handleOnAlignChange( align ) {
		let newAlignValue;

		if ( 'boolean' === typeof align ) {
			newAlignValue = align;
		} else {
			newAlignValue = ! Array.isArray( value.align.value )
				? []
				: [ ...value.align.value ];

			if ( ! newAlignValue.includes( align ) ) {
				newAlignValue.push( align );
			} else {
				newAlignValue = newAlignValue.filter( ( v ) => v !== align );
			}
		}

		onChange( {
			...value,
			align: { ...value.align, value: newAlignValue },
		} );
	}

	/**
	 * Handle changes on other supports settings.
	 *
	 * @param {string} key Name of the supports.
	 * @param {Object} change New value for the supports.
	 */
	function handleOnChange( key, change ) {
		onChange( merge( {}, value, { [ key ]: change } ) );
	}

	return (
		<div className="bmfbe-supports">
			{ map( value, ( val, key ) => {
				const wrapperClasses = classnames(
					'bmfbe-supports',
					`bmfbe-supports--${ key }`
				);

				return (
					<div key={ key } className={ wrapperClasses }>
						<IndeterminateToggleControl
							label={ key }
							checked={ val.isActive }
							disabled={ disabled }
							onChange={ ( { checked } ) =>
								handleOnChange( key, { isActive: checked } )
							}
						/>
						<div className="bmfbe-supports__values">
							{ Array.isArray( supportsValues[ key ] ) ? (
								supportsValues[
									key
								].map( ( { label, value: alignValue } ) => (
									<IndeterminateToggleControl
										key={ label }
										label={ label }
										checked={
											val.value === alignValue ||
											( Array.isArray( val.value ) &&
												val.value.includes(
													alignValue
												) )
										}
										disabled={ disabled || ! val.isActive }
										onChange={ () =>
											handleOnAlignChange( alignValue )
										}
									/>
								) )
							) : (
								<IndeterminateToggleControl
									label={ __( 'Enable', 'bmfbe' ) }
									value={ val.value }
									disabled={ disabled || ! val.isActive }
									onChange={ ( { checked } ) =>
										handleOnChange( key, {
											value: checked,
										} )
									}
								/>
							) }
						</div>
					</div>
				);
			} ) }
		</div>
	);
}

/**
 * External dependencies
 */
import classnames from 'classnames';
import { difference, map, merge, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IndeterminateToggleControl from './indeterminate-toggle-control';

/**
 * List of fields for supports that are not boolean.
 *
 * @constant {*}
 * @since 1.0.0
 */
const supportsFields = {
	align: [
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

/**
 * List of values for align supports.
 *
 * @constant {string[]}
 * @since 1.0.0
 */
const alignValues = supportsFields.align.map( ( a ) => a.value );

/**
 * Transform align supports from boolean/array to array only.
 *
 * @param {boolean|string[]} align Current align value.
 *
 * @return {string[]} Transformed align supports.
 * @since 1.0.0
 */
function alignValueToArray( align ) {
	if ( true === align ) {
		return [ ...alignValues ];
	}

	if ( Array.isArray( align ) ) {
		return [ ...align ];
	}

	return [];
}

export default function Supports( {
	disabled = false,
	onChange = noop,
	value = {},
} ) {
	/**
	 * Handle changes on align supports.
	 *
	 * @param {string} align New align values.
	 * @param {boolean} enabled Enable current value of align.
	 *
	 * @since 1.0.0
	 */
	function handleOnAlignChange( align, enabled ) {
		const currentAlignValues = alignValueToArray( value.align.value );
		let newAlignValues = [ ...currentAlignValues ];

		if ( enabled && ! newAlignValues.includes( align ) ) {
			newAlignValues.push( align );
		} else if ( ! enabled && newAlignValues.includes( align ) ) {
			newAlignValues = newAlignValues.filter( ( v ) => v !== align );
		}

		if ( 0 === newAlignValues.length ) {
			newAlignValues = false;
		} else if ( 0 === difference( alignValues, newAlignValues ).length ) {
			newAlignValues = true;
		}

		value.align.value = newAlignValues;

		onChange( value );
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
							{ Array.isArray( supportsFields[ key ] ) ? (
								supportsFields[
									key
								].map( ( { label, value: alignValue } ) => (
									<IndeterminateToggleControl
										key={ label }
										label={ label }
										checked={
											true === val.value ||
											( Array.isArray( val.value ) &&
												val.value.includes(
													alignValue
												) )
										}
										disabled={ disabled || ! val.isActive }
										onChange={ ( { checked } ) =>
											handleOnAlignChange(
												alignValue,
												checked
											)
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

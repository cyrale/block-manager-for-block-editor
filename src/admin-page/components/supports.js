/**
 * External dependencies
 */
import classnames from 'classnames';
import { difference, intersection, merge, noop } from 'lodash';
import { Parser as HtmlToReactParser } from 'html-to-react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IndeterminateToggleControl from './indeterminate-toggle-control';

/**
 * List of values for align supports.
 *
 * @constant {string[]}
 * @since 1.0.0
 */
const alignValues = Array.isArray(
	bmfbeAdminGlobal.availableSupportsFields?.align?.values
)
	? bmfbeAdminGlobal.availableSupportsFields.align.values.map(
			( a ) => a.value
	  )
	: [];

/**
 * Parser to convert raw HTML from translations to React DOM structure.
 *
 * @constant {{parse: *, parseWithInstructions: *}}
 * @since 1.0.0
 */
const htmlToReactParser = new HtmlToReactParser();

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
	 * @param {string} fieldName Name of the supports.
	 * @param {Object} change New value for the supports.
	 */
	function handleOnChange( fieldName, change ) {
		onChange( merge( {}, value, { [ fieldName ]: change } ) );
	}

	const supportsFieldKeys = intersection(
		Object.keys( bmfbeAdminGlobal.availableSupportsFields ),
		Object.keys( value )
	);

	return (
		<div className="bmfbe-supports">
			{ supportsFieldKeys.map( ( fieldName ) => {
				const wrapperClasses = classnames(
					'bmfbe-supports-settings',
					`bmfbe-supports-settings--${ fieldName }`
				);

				const field =
					bmfbeAdminGlobal.availableSupportsFields[ fieldName ];
				const val = value[ fieldName ];

				return (
					<div key={ fieldName } className={ wrapperClasses }>
						<IndeterminateToggleControl
							label={ fieldName }
							help={ htmlToReactParser.parse( field.help ) }
							checked={ val.isActive }
							disabled={ disabled }
							onChange={ ( { checked } ) =>
								handleOnChange( fieldName, {
									isActive: checked,
								} )
							}
						/>
						<div className="bmfbe-supports-settings__values">
							{ Array.isArray( field?.values ) ? (
								field.values.map(
									( { label, value: alignValue } ) => (
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
											disabled={
												disabled || ! val.isActive
											}
											onChange={ ( { checked } ) =>
												handleOnAlignChange(
													alignValue,
													checked
												)
											}
										/>
									)
								)
							) : (
								<IndeterminateToggleControl
									label={ __( 'Enable', 'bmfbe' ) }
									checked={ val.value }
									disabled={ disabled || ! val.isActive }
									onChange={ ( { checked } ) =>
										handleOnChange( fieldName, {
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

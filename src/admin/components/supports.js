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
 * List of fields for supports that are not boolean.
 *
 * @constant {*}
 * @since 1.0.0
 */
const supportsFields = {
	align: {
		help: __(
			'This property adds block controls which allow to change block’s alignment. <em>Important: It doesn’t work with dynamic blocks yet.</em>',
			'bmfbe'
		),
		values: [
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
	},
	alignWide: {
		help: __(
			'This property allows to enable wide alignment for your theme. To disable this behavior for a single block, set this flag to <code>false</code>.',
			'bmfbe'
		),
	},
	anchor: {
		help: __(
			'Anchors let you link directly to a specific block on a page. This property adds a field to define an id for the block and a button to copy the direct link.',
			'bmfbe'
		),
	},
	className: {
		help: __(
			'By default, the class <code>.wp-block-your-block-name</code> is added to the root element of your saved markup. This helps having a consistent mechanism for styling blocks that themes and plugins can rely on. If for whatever reason a class is not desired on the markup, this functionality can be disabled.',
			'bmfbe'
		),
	},
	customClassName: {
		help: __(
			'This property adds a field to define a custom className for the block’s wrapper.',
			'bmfbe'
		),
	},
	defaultStylePicker: {
		help: __(
			'When the style picker is shown, a dropdown is displayed so the user can select a default style for this block type. If you prefer not to show the dropdown, set this property to <code>false</code>.',
			'bmfbe'
		),
	},
	html: {
		help: __(
			'By default, a block’s markup can be edited individually. To disable this behavior, set <code>html</code> to <code>false</code>.',
			'bmfbe'
		),
	},
	inserter: {
		help: __(
			'By default, all blocks will appear in the inserter. To hide a block so that it can only be inserted programmatically, set <code>inserter</code> to <code>false</code>.',
			'bmfbe'
		),
	},
	multiple: {
		help: __(
			'A non-multiple block can be inserted into each post, one time only. For example, the built-in ‘More’ block cannot be inserted again if it already exists in the post being edited. A non-multiple block’s icon is automatically dimmed (unclickable) to prevent multiple instances.',
			'bmfbe'
		),
	},
	reusable: {
		help: __(
			'A block may want to disable the ability of being converted into a reusable block. By default all blocks can be converted to a reusable block. If supports reusable is set to false, the option to convert the block into a reusable block will not appear.',
			'bmfbe'
		),
	},
};

/**
 * List of values for align supports.
 *
 * @constant {string[]}
 * @since 1.0.0
 */
const alignValues = supportsFields.align.values.map( ( a ) => a.value );

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
		Object.keys( supportsFields ),
		Object.keys( value )
	);

	return (
		<div className="bmfbe-supports">
			{ supportsFieldKeys.map( ( fieldName ) => {
				const wrapperClasses = classnames(
					'bmfbe-supports-settings',
					`bmfbe-supports-settings--${ fieldName }`
				);

				const field = supportsFields[ fieldName ];
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

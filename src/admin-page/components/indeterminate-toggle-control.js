/**
 * External dependencies
 */
import classnames from 'classnames';
import { isFunction, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { BaseControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import IndeterminateToggle from './indeterminate-toggle';

export default function IndeterminateToggleControl( {
	label,
	disabled,
	checked,
	indeterminate,
	help,
	className,
	onChange = noop,
} ) {
	const instanceId = useInstanceId( IndeterminateToggleControl );
	const id = `indeterminate-toggle-control-${ instanceId }`;

	let describedBy, helpLabel;
	if ( help ) {
		describedBy = instanceId + '__help';
		helpLabel = isFunction( help ) ? help( checked ) : help;
	}

	function handleOnChange( e ) {
		onChange( {
			checked: e.target.checked,
			indeterminate: false,
		} );
	}

	return (
		<BaseControl
			id={ id }
			className={ classnames(
				'indeterminate-toggle-control',
				className
			) }
			help={ helpLabel }
		>
			<IndeterminateToggle
				id={ id }
				disabled={ disabled }
				checked={ checked }
				indeterminate={ indeterminate }
				onChange={ handleOnChange }
				aria-describedby={ describedBy }
			/>
			<label
				htmlFor={ id }
				className="indeterminate-toggle-control__label"
			>
				{ label }
			</label>
		</BaseControl>
	);
}

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/primitives';
import { useEffect, useRef } from '@wordpress/element';

export default function IndeterminateToggle( {
	className,
	checked,
	disabled,
	id,
	indeterminate,
	onChange = noop,
	...props
} ) {
	const wrapperClasses = classnames( 'indeterminate-toggle', className, {
		'is-checked': checked,
		'is-disabled': disabled,
		'is-indeterminate': indeterminate,
	} );

	const checkboxRef = useRef( null );

	useEffect( () => {
		checkboxRef.current.checked = checked;
		checkboxRef.current.indeterminate = indeterminate;
	}, [ checked, indeterminate ] );

	return (
		<span className={ wrapperClasses }>
			<input
				ref={ checkboxRef }
				className="indeterminate-toggle__input"
				id={ id }
				type="checkbox"
				checked={ checked }
				disabled={ disabled }
				onClick={ ( e ) => {
					e.stopPropagation();
				} }
				onChange={ onChange }
				{ ...props }
			/>
			<span className="indeterminate-toggle__track" />
			<span className="indeterminate-toggle__thumb" />
			{ ! indeterminate && checked && (
				<SVG
					className="indeterminate-toggle__on"
					width="2"
					height="6"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2 6"
				>
					<Path d="M0 0h2v6H0z" />
				</SVG>
			) }
			{ ! indeterminate && ! checked && (
				<SVG
					className="indeterminate-toggle__off"
					width="6"
					height="6"
					aria-hidden="true"
					role="img"
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 6 6"
				>
					<Path d="M3 1.5c.8 0 1.5.7 1.5 1.5S3.8 4.5 3 4.5 1.5 3.8 1.5 3 2.2 1.5 3 1.5M3 0C1.3 0 0 1.3 0 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
				</SVG>
			) }
			{ indeterminate && (
				<SVG
					className="indeterminate-toggle__indeterminate"
					width="6"
					height="6"
					aria-hidden="true"
					role="img"
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 6 6"
				>
					<Path d="M4.92 1.55A1.9 1.9 0 004 .37 1.93 1.93 0 001.11 2v.15h1.2V2a.74.74 0 01.74-.74.73.73 0 01.52.22.74.74 0 01-.44 1.26.76.76 0 00-.68.75v.89h1.19v-.51a1.92 1.92 0 001.28-2.32zM2.45 4.71h1.19V5.9H2.45z" />
				</SVG>
			) }
		</span>
	);
}

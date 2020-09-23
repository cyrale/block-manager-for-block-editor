/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { Button, VisuallyHidden } from '@wordpress/components';
import { useRef } from '@wordpress/element';
import { Icon, search, closeSmall } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export default function SearchForm( {
	onChange = noop,
	placeholder = __( 'Type something to search', 'bmfbe' ),
	value = '',
} ) {
	const instanceId = useInstanceId( SearchForm, 'bmfbe-search-form' );
	const searchInput = useRef();

	return (
		<div className="bmfbe-search-form">
			<VisuallyHidden
				as="label"
				className="bmfbe-search-form__label"
				htmlFor={ instanceId }
			>
				{ placeholder }
			</VisuallyHidden>
			<input
				ref={ searchInput }
				className="bmfbe-search-form__input"
				id={ instanceId }
				type="search"
				placeholder={ placeholder }
				onChange={ ( e ) => onChange( e.target.value ) }
				autoComplete="off"
				value={ value }
			/>
			<div className="bmfbe-search-form__icon">
				{ !! value && (
					<Button
						icon={ closeSmall }
						label={ __( 'Reset search', 'bmfbe' ) }
						onClick={ () => {
							onChange( '' );
							searchInput.current.focus();
						} }
					/>
				) }
				{ ! value && <Icon icon={ search } /> }
			</div>
		</div>
	);
}

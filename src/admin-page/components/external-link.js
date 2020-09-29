/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Icon, external } from '@wordpress/icons';

export default function ExternalLink( { className = '', link } ) {
	return (
		<a
			href={ link }
			className={ classnames( 'bmfbe-external-link', className ) }
			target="_blank"
			rel="noopener noreferrer"
			onClick={ ( e ) => {
				e.stopPropagation();
			} }
		>
			<Icon icon={ external } size={ 18 } />
		</a>
	);
}

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

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
			<SVG
				width="18"
				height="18"
				aria-hidden="true"
				role="img"
				focusable="false"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<Path d="M9 3h8v8l-2-1V6.92l-5.6 5.59-1.41-1.41L14.08 5H10zm3 12v-3l2-2v7H3V6h8L9 8H5v7h7z" />
			</SVG>
		</a>
	);
}

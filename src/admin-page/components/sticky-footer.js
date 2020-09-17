/**
 * External dependencies
 */
import classnames from 'classnames';
import { useIntersection } from 'react-use';

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';

export default function StickyFooter( { children } ) {
	const sentinelRef = useRef( null );

	const sentinel = useIntersection( sentinelRef, {
		root: null,
		rootMargin: '0px',
		threshold: 1,
	} );

	return (
		<>
			<div
				className={ classnames( 'bmfbe-sticky-footer', {
					'is-stuck':
						undefined === sentinel ||
						sentinel?.intersectionRatio < 1,
				} ) }
			>
				{ children }
			</div>
			<div
				className="bmfbe-sticky-footer__sentinel"
				ref={ sentinelRef }
			/>
		</>
	);
}

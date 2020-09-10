/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import Admin from './admin/admin.js';

import './sass/admin.scss';

domReady( () => {
	registerCoreBlocks();

	const container = document.getElementById( 'bmfbeSettings' );
	if ( null !== container ) {
		render( <Admin />, container );
	}
} );

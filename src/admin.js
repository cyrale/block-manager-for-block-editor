/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import AdminPage from './admin-page';

import './sass/admin.scss';

domReady( () => {
	registerCoreBlocks();

	const container = document.getElementById( 'bmfbeSettings' );
	if ( null !== container ) {
		render( <AdminPage />, container );
	}
} );

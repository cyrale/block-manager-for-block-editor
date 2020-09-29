/**
 * External dependencies
 */
import { HashRouter } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import { registerCoreBlocks } from '@wordpress/block-library';
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdminPage from './admin-page';

import './sass/admin.scss';

domReady( () => {
	registerCoreBlocks();

	const container = document.getElementById( 'bmfbeSettings' );
	if ( null !== container ) {
		render(
			<HashRouter>
				<AdminPage />
			</HashRouter>,
			container
		);
	}
} );

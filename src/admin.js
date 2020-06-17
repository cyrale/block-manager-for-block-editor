import { render } from '@wordpress/element';

import './sass/admin.scss';
import Admin from './libs/admin/admin.js';

const container = document.getElementById( 'bmfbeSettings' );

if ( null !== container ) {
	render( <Admin />, container );
}

import './sass/admin.scss';

import Admin from './libs/admin/admin';

const {
	element: { render },
} = wp;

const container = document.getElementById( 'bmfbeSettings' );

if ( null !== container ) {
	render( <Admin />, container );
}

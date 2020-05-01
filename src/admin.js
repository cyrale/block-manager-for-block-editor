import './sass/admin.scss';

import Admin from './libs/admin/admin';

const container = document.getElementById( 'bmfbeSettings' );

if ( null !== container ) {
	ReactDOM.render( <Admin />, container );
}

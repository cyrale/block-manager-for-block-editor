import './sass/admin.scss';

import App from './libs/admin/app';

const container = document.getElementById( 'bmfbeSettings' );

if ( null !== container ) {
	ReactDOM.render( <App />, container );
}

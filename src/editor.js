import './sass/editor.scss';
import customize from './libs/customize';
import detect from './libs/detect';

if ( ! bmfbeEditorGlobal.detect ) {
	customize();
}

wp.domReady( () => {
	if ( bmfbeEditorGlobal.detect ) {
		detect();
	}
} );

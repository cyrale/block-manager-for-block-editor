import './sass/editor.scss';

import detect from './libs/detect';
import customize from './libs/customize';

if ( ! bmfbeEditorGlobal.detection ) {
	customize();
}

wp.domReady( () => {
	if ( bmfbeEditorGlobal.detect ) {
		detect();
	}
} );

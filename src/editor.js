import './sass/editor.scss';

import detection from './libs/detection';
import customize from './libs/customize';

if ( ! bmfbeEditorGlobal.detection ) {
	customize();
}

wp.domReady( () => {
	if ( bmfbeEditorGlobal.detection ) {
		detection();
	}
} );

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import customize from './libs/customize';
import detect from './libs/detect';

import './sass/editor.scss';

if ( ! bmfbeEditorGlobal.detect ) {
	customize();
}

domReady( () => {
	if ( bmfbeEditorGlobal.detect ) {
		detect();
	}
} );

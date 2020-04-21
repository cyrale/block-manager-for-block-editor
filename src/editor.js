import './sass/editor.scss';

import detection from './libs/detection';
import customize from './libs/customize';

wp.domReady( () => {
	// // Remove blocks
	// wp.blocks.getBlockTypes().forEach( ( blockType ) => {
	// 	if ( blockType.name === 'core/paragraph' ) {
	// 		wp.blocks.unregisterBlockType( blockType.name );
	// 	}
	// } );

	if ( bmfbeEditorGlobal.detection ) {
		detection();
	} else {
		customize();
	}
} );

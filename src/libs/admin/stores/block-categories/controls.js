import {
	allBlockCategories,
	updateBlockCategories,
} from '../../api/block-categories';

export function API_FETCH_ALL() {
	return allBlockCategories();
}

export function SAVE_SETTINGS( { settings } ) {
	return updateBlockCategories( settings );
}

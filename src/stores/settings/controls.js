import { allSettings, updateSettings } from '../../api/settings';

export function API_FETCH_ALL() {
	return allSettings();
}

export function SAVE_SETTINGS( { settings } ) {
	return updateSettings( settings );
}

import * as actions from './actions';
import { SETTINGS_API_PATH } from './constants';

export function* getSettings() {
	const settings = yield actions.fetchAllFromAPI( SETTINGS_API_PATH );
	return actions.initSettings( settings );
}

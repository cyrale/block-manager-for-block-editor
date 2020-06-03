import { allSettings } from '../../api/settings';

export function API_FETCH_ALL() {
	return allSettings();
}

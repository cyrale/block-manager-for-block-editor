import * as actions from './actions';

export function* getItem() {
	const item = yield actions.fetchAllFromAPI();
	return actions.initItem( item );
}

import * as actions from './actions';

export function* getPatternCategories() {
	const categories = yield actions.fetchAllCategoriesFromAPI();

	return actions.initPatternCategories( categories );
}

export function* getPatterns() {
	const patterns = yield actions.fetchAllFromAPI();

	return actions.initPatterns( patterns );
}

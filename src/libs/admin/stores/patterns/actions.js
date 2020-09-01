export { fetchAllFromAPI } from '../actions';

export function fetchAllCategoriesFromAPI() {
	return {
		type: 'API_FETCH_ALL_CATEGORIES',
	};
}

export function initPatternCategories( categories ) {
	return {
		type: 'INIT_PATTERN_CATEGORIES',
		categories,
	};
}

export function initPatterns( patterns ) {
	return {
		type: 'INIT_PATTERNS',
		patterns,
	};
}

export function updatePattern( name, value ) {
	return {
		type: 'UPDATE_PATTERN',
		name,
		value,
	};
}

export function* savePattern( pattern ) {
	yield {
		type: 'SAVE_PATTERN_START',
		pattern,
	};

	const savedPattern = yield {
		type: 'SAVE_PATTERN',
		pattern,
	};

	yield {
		type: 'UPDATE_PATTERN',
		name: savedPattern.name,
		value: savedPattern,
	};

	yield {
		type: 'SAVE_PATTERN_FINISH',
		pattern,
	};

	return savedPattern;
}

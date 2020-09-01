import {
	allPatterns,
	allPatternCategories,
	updatePattern,
} from '../../api/patterns';

export function API_FETCH_ALL_CATEGORIES() {
	return allPatternCategories();
}

export function API_FETCH_ALL() {
	return allPatterns();
}

export function SAVE_PATTERN( { pattern } ) {
	return updatePattern( pattern );
}

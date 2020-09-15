import {
	allPatterns,
	allPatternCategories,
	updatePattern,
} from '../../api/patterns';

export const API_FETCH_ALL_CATEGORIES = allPatternCategories;
export const API_FETCH_ALL = allPatterns;

export function SAVE_ITEM( { item } ) {
	return updatePattern( item );
}

/**
 * External dependencies
 */
import { deburr, differenceWith, words } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';

/**
 * Converts the search term into a list of normalized terms.
 *
 * @param {string} term The search term to normalize.
 *
 * @return {string[]} The normalized list of search terms.
 */
export const normalizeSearchTerm = ( term = '' ) => {
	// Disregard diacritics.
	//  Input: "média"
	term = deburr( term );

	// Accommodate leading slash, matching autocomplete expectations.
	//  Input: "/media"
	term = term.replace( /^\//, '' );

	// Lowercase.
	//  Input: "MEDIA"
	term = term.toLowerCase();

	// Extract words.
	return words( term );
};

const removeMatchingTerms = ( unmatchedTerms, unprocessedTerms ) => {
	return differenceWith(
		unmatchedTerms,
		normalizeSearchTerm( unprocessedTerms ),
		( unmatchedTerm, unprocessedTerm ) =>
			unprocessedTerm.includes( unmatchedTerm )
	);
};

/**
 * Filters an item list given a search term.
 *
 * @param {Array} items       Item list
 * @param {string} searchTerm Search term.
 * @param {Object} config     Search Config.
 *
 * @return {Array} Filtered item list.
 */
export function searchItems( items = [], searchTerm = '', config = {} ) {
	const normalizedSearchTerms = normalizeSearchTerm( searchTerm );
	if ( normalizedSearchTerms.length === 0 ) {
		return items;
	}

	const defaultGetName = ( item ) => item.name;
	const defaultGetTitle = ( item ) => item.title;
	const defaultGetDescription = ( item ) => item.description;
	const defaultGetKeywords = ( item ) => item.keywords || [];
	const defaultGetCategories = ( item ) => item.categories || [];
	const defaultGetCollection = () => null;
	const defaultGetVariations = () => [];
	const {
		getName = defaultGetName,
		getTitle = defaultGetTitle,
		getDescription = defaultGetDescription,
		getKeywords = defaultGetKeywords,
		getCategories = defaultGetCategories,
		getCollection = defaultGetCollection,
		getVariations = defaultGetVariations,
	} = config;

	return items.filter( ( item ) => {
		const name = getName( items );
		const title = getTitle( item );
		const description = getDescription( item );
		const keywords = getKeywords( item );
		const categories = getCategories( item );
		const collection = getCollection( item );
		const variations = getVariations( item );

		const terms = [
			name,
			title,
			description,
			...keywords,
			...categories,
			collection,
			...variations,
		].join( ' ' );

		const unmatchedTerms = removeMatchingTerms(
			normalizedSearchTerms,
			terms
		);

		return unmatchedTerms.length === 0;
	} );
}

export default function useSearchForm() {
	const [ items, setItems ] = useState( [] );
	const [ filterValue, setFilterValue ] = useState( '' );

	const filteredItems = useMemo( () => searchItems( items, filterValue ), [
		filterValue,
		items,
	] );

	return {
		filteredItems,
		setItems,
		filterValue,
		setFilterValue,
	};
}

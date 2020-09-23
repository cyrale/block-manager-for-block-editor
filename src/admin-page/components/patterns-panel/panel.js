/**
 * WordPress dependencies
 */
import { select as wpSelect, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { COLLECTION_STORE as PATTERNS_STORE } from '../../../stores/patterns/constants';
import GenericPanel from '../panel';
import Pattern from './pattern';

export default function Panel() {
	const { categories, patterns, status } = useSelect( ( select ) => {
		const store = select( PATTERNS_STORE );

		return {
			categories: store.getCategories(),
			patterns: store.getCollection(),
			status: store.getStatus(),
		};
	}, [] );

	return (
		<GenericPanel
			className="bmfbe-patterns-panel"
			categories={ categories }
			items={ patterns.map( ( { name } ) =>
				wpSelect( PATTERNS_STORE ).getItem( name )
			) }
			status={ status }
			labels={ {
				searchForm: __( 'Search for a pattern', 'bmfbe' ),
				notFound: __( 'Pattern not found.', 'bmfbe' ),
			} }
		>
			{ patterns.map( ( pattern ) => (
				<Pattern key={ pattern.name } { ...pattern } />
			) ) }
		</GenericPanel>
	);
}

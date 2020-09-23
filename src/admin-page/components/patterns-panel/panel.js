/**
 * External dependencies
 */
import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

/**
 * WordPress dependencies
 */
import { select as wpSelect, useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useSearchForm from '../../../hooks/use-search-form';
import {
	COLLECTION_STORE as PATTERNS_STORE,
	STATUS_LOADING,
} from '../../../stores/patterns/constants';
import NotFound from '../not-found';
import SearchForm from '../search-form';
import Pattern from './pattern';

export default function Panel() {
	const {
		filteredItems,
		setItems,
		filterValue,
		setFilterValue,
	} = useSearchForm();

	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	const { categories, patterns, status } = useSelect( ( select ) => {
		const store = select( PATTERNS_STORE );

		return {
			categories: store.getCategories(),
			patterns: store.getCollection(),
			status: store.getStatus(),
		};
	}, [] );

	// Initialize patterns with those from API.
	useEffect( () => {
		setItems(
			patterns.map( ( { name } ) =>
				wpSelect( PATTERNS_STORE ).getItem( name )
			)
		);
	}, [ patterns ] );

	// Set displayed category.
	useEffect( () => {
		const defaultDisplayedCategories = {};

		categories.forEach( ( { name }, index ) => {
			defaultDisplayedCategories[ name ] = 0 === index;
		} );

		setDisplayedCategories( defaultDisplayedCategories );
	}, [ categories ] );

	/**
	 * Handle changes with accordion. Display or hide categories.
	 *
	 * @param {string[]} accordionNames Names of displayed categories.
	 * @since 1.0.0
	 */
	function handleAccordionChange( accordionNames ) {
		const currentDisplayedCategories = {};

		categories.forEach( ( { name } ) => {
			currentDisplayedCategories[ name ] = accordionNames.includes(
				name
			);
		} );

		setDisplayedCategories( currentDisplayedCategories );
	}

	return (
		<div className="bmfbe-patterns-panel">
			{ STATUS_LOADING !== status && 0 !== categories.length && (
				<>
					<SearchForm
						value={ filterValue }
						placeholder={ __( 'Search for a pattern', 'bmfbe' ) }
						onChange={ setFilterValue }
					/>
					{ 0 === filteredItems.length && (
						<NotFound
							label={ __( 'Pattern not found.', 'bmfbe' ) }
						/>
					) }
					{ 0 !== filteredItems.length && (
						<Accordion
							allowZeroExpanded={ true }
							preExpanded={ [ categories[ 0 ].name ] }
							onChange={ handleAccordionChange }
						>
							{ categories.map( ( category ) => {
								const categorizedPatterns = filteredItems.filter(
									( { categories: c } ) =>
										c.includes( category.name )
								);

								if ( 0 === categorizedPatterns.length ) {
									return <Fragment key={ category.name } />;
								}

								return (
									<AccordionItem
										key={ category.name }
										uuid={ category.name }
									>
										<AccordionItemHeading>
											<AccordionItemButton>
												{ category.label }
												<em>
													(
													{
														categorizedPatterns.length
													}
													)
												</em>
											</AccordionItemButton>
										</AccordionItemHeading>
										<AccordionItemPanel>
											{ displayedCategories[
												category.name
											] &&
												categorizedPatterns.map(
													( pattern ) => (
														<Pattern
															key={ pattern.name }
															{ ...pattern }
														/>
													)
												) }
										</AccordionItemPanel>
									</AccordionItem>
								);
							} ) }
						</Accordion>
					) }
				</>
			) }
		</div>
	);
}

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
	COLLECTION_STORE as BLOCKS_STORE,
	STATUS_LOADING,
} from '../../../stores/blocks/constants';
import NotFound from '../not-found';
import SearchForm from '../search-form';
import Block from './block';

export default function Panel() {
	const {
		filteredItems,
		setItems,
		filterValue,
		setFilterValue,
	} = useSearchForm();

	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	const { blocks, categories, status } = useSelect( ( select ) => {
		const store = select( BLOCKS_STORE );

		return {
			blocks: store.getCollection(),
			categories: store.getCategories(),
			status: store.getStatus(),
		};
	}, [] );

	// Initialize blocks with those from API.
	useEffect( () => {
		setItems(
			blocks.map( ( { name } ) =>
				wpSelect( BLOCKS_STORE ).getItem( name )
			)
		);
	}, [ blocks ] );

	// Set displayed category.
	useEffect( () => {
		const defaultDisplayedCategories = {};

		categories.forEach( ( { slug }, index ) => {
			defaultDisplayedCategories[ slug ] = 0 === index;
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

		categories.forEach( ( { slug } ) => {
			currentDisplayedCategories[ slug ] = accordionNames.includes(
				slug
			);
		} );

		setDisplayedCategories( currentDisplayedCategories );
	}

	return (
		<div className="bmfbe-blocks-panel">
			{ STATUS_LOADING !== status && 0 !== categories.length && (
				<>
					<SearchForm
						value={ filterValue }
						placeholder={ __( 'Search for a block', 'bmfbe' ) }
						onChange={ setFilterValue }
					/>
					{ 0 === filteredItems.length && (
						<NotFound label={ __( 'Block not found.', 'bmfbe' ) } />
					) }
					{ 0 !== filteredItems.length && (
						<Accordion
							allowZeroExpanded={ true }
							preExpanded={ [ categories[ 0 ].slug ] }
							onChange={ handleAccordionChange }
						>
							{ categories.map( ( category ) => {
								const categorizedBlocks = filteredItems.filter(
									( { category: c } ) =>
										c.includes( category.slug )
								);

								if ( 0 === categorizedBlocks.length ) {
									return <Fragment key={ category.slug } />;
								}

								return (
									<AccordionItem
										key={ category.slug }
										uuid={ category.slug }
									>
										<AccordionItemHeading>
											<AccordionItemButton>
												{ category.title }
												<em>
													(
													{ categorizedBlocks.length }
													)
												</em>
											</AccordionItemButton>
										</AccordionItemHeading>
										<AccordionItemPanel>
											{ displayedCategories[
												category.slug
											] &&
												categorizedBlocks.map(
													( block ) => (
														<Block
															key={ block.name }
															{ ...block }
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

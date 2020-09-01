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
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BLOCKS_STORE } from '../../stores/blocks/constants';
import Block from './block';

export default function Panel() {
	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	const { blocks, categories } = useSelect(
		( select ) => ( {
			blocks: select( BLOCKS_STORE ).getBlocks(),
			categories: select( BLOCKS_STORE ).getBlockCategories(),
		} ),
		[]
	);

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
			{ 0 === categories.length ? (
				<></>
			) : (
				<Accordion
					allowZeroExpanded={ true }
					preExpanded={ [ categories[ 0 ].slug ] }
					onChange={ handleAccordionChange }
				>
					{ categories.map( ( category ) => {
						const categorizedBlocks = blocks.filter(
							( { category: c } ) => c === category.slug
						);

						if ( 0 === categorizedBlocks.length ) {
							return <Fragment key={ category.slug }></Fragment>;
						}

						return (
							<AccordionItem
								key={ category.slug }
								uuid={ category.slug }
							>
								<AccordionItemHeading>
									<AccordionItemButton>
										{ category.title }
										<em>({ categorizedBlocks.length })</em>
									</AccordionItemButton>
								</AccordionItemHeading>
								<AccordionItemPanel>
									{ displayedCategories[ category.slug ] &&
										categorizedBlocks.map( ( block ) => (
											<Block
												key={ block.name }
												{ ...block }
											/>
										) ) }
								</AccordionItemPanel>
							</AccordionItem>
						);
					} ) }
				</Accordion>
			) }
		</div>
	);
}

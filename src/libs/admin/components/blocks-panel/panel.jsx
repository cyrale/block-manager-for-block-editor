import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { BLOCKS_STORE } from '../../stores/blocks/constants';
import Block from './block';

const {
	data: { useSelect },
	element: { useEffect, useState },
} = wp;

export default function Panel() {
	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	const { blocks, categories } = useSelect(
		( select ) => ( {
			blocks: select( BLOCKS_STORE ).getBlocks(),
			categories: select( BLOCKS_STORE ).getCategories(),
		} ),
		[]
	);

	useEffect( () => {
		const defaultDisplayedCategories = {};

		categories.forEach( ( category, index ) => {
			defaultDisplayedCategories[ category ] = 0 === index;
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

		categories.forEach( ( category ) => {
			currentDisplayedCategories[ category ] = accordionNames.includes(
				category
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
					preExpanded={ [ categories[ 0 ] ] }
					onChange={ handleAccordionChange }
				>
					{ categories.map( ( category ) => (
						<AccordionItem key={ category } uuid={ category }>
							<AccordionItemHeading>
								<AccordionItemButton>
									{ category }
								</AccordionItemButton>
							</AccordionItemHeading>
							<AccordionItemPanel>
								{ displayedCategories[ category ] &&
									blocks
										.filter(
											( block ) =>
												block.category === category
										)
										.map( ( block ) => (
											<Block
												key={ block.name }
												{ ...block }
											/>
										) ) }
							</AccordionItemPanel>
						</AccordionItem>
					) ) }
				</Accordion>
			) }
		</div>
	);
}

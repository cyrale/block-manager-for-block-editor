import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { BLOCKS_PANEL_STORE } from './store/constants';
import Block from './block';

const {
	data: { useSelect },
} = wp;

export default function Panel() {
	const { blocks, categories } = useSelect(
		( select ) => ( {
			blocks: select( BLOCKS_PANEL_STORE ).getBlocks(),
			categories: select( BLOCKS_PANEL_STORE ).getCategories(),
		} ),
		[]
	);

	return (
		<div className="bmfbe-blocks-panel">
			{ categories.length === 0 ? (
				<></>
			) : (
				<Accordion
					allowMultipleExpanded={ true }
					allowZeroExpanded={ true }
					preExpanded={ [ categories[ 0 ] ] }
				>
					{ categories.map( ( category ) => (
						<AccordionItem key={ category } uuid={ category }>
							<AccordionItemHeading>
								<AccordionItemButton>
									{ category }
								</AccordionItemButton>
							</AccordionItemHeading>
							<AccordionItemPanel>
								{ blocks
									.filter(
										( block ) => block.category === category
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

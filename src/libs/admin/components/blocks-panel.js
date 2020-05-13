import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import Block from './block';
import useBlocks from '../use-blocks';
import { BlocksProvider } from '../blocks-context';

const Blocks = () => {
	const { getBlocks } = useBlocks();

	const categories = getBlocks().reduce( ( acc, { category } ) => {
		if ( ! acc.includes( category ) ) {
			acc.push( category );
		}

		return acc;
	}, [] );

	const accordionChild =
		categories.length === 0 ? (
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
							{ getBlocks()
								.filter(
									( block ) => block.category === category
								)
								.map( ( block ) => (
									<Block
										key={ block.name }
										name={ block.name }
									/>
								) ) }
						</AccordionItemPanel>
					</AccordionItem>
				) ) }
			</Accordion>
		);

	return <div className="bmfbe-blocks">{ accordionChild }</div>;
};

const BlocksPanel = () => (
	<BlocksProvider>
		<Blocks />
	</BlocksProvider>
);

export default BlocksPanel;

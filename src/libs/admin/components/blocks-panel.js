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

const BlocksPanel = () => {
	const { getBlocks } = useBlocks();

	const categories = getBlocks().reduce( ( acc, { category } ) => {
		if ( ! acc.includes( category ) ) {
			acc.push( category );
		}

		return acc;
	}, [] );

	if ( categories.length === 0 ) {
		return <></>;
	}

	return (
		<BlocksProvider>
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
		</BlocksProvider>
	);
};

export default BlocksPanel;

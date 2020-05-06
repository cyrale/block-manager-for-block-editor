import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import Block from './block';
import useBlocks from '../use-blocks';

const {
	i18n: { __ },
} = wp;

const Blocks = () => {
	const { getBlocksList } = useBlocks();

	const categories = getBlocksList().reduce( ( acc, { category } ) => {
		if ( ! acc.includes( category ) ) {
			acc.push( category );
		}

		return acc;
	}, [] );

	if ( categories.length === 0 ) {
		return <></>;
	}

	return (
		<>
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
							{ getBlocksList()
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
			<button>{ __( 'Save', 'bmfbe' ) }</button>
		</>
	);
};

export default Blocks;

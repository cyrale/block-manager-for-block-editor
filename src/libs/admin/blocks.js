import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getRegisteredBlocks } from '../registered-blocks';
import Block from './block';

const {
	i18n: { __ },
} = wp;

const Blocks = () => {
	const [ blocks, setBlocks ] = useState( [] );
	useEffect( () => {
		const fetchBlocks = async () => {
			setBlocks( await getRegisteredBlocks() );
		};

		fetchBlocks();
	} );

	if ( blocks.length === 0 ) {
		return <div>{ __( 'Loading...', 'bmfbe' ) }</div>;
	}

	const categories = blocks.reduce( ( cats, block ) => {
		if ( ! cats.includes( block.category ) ) {
			cats.push( block.category );
		}

		return cats;
	}, [] );

	return (
		<Accordion
			allowMultipleExpanded={ true }
			allowZeroExpanded={ true }
			preExpanded={ [ categories[ 0 ] ] }
		>
			{ categories.map( ( category ) => (
				<AccordionItem key={ category } uuid={ category }>
					<AccordionItemHeading>
						<AccordionItemButton>{ category }</AccordionItemButton>
					</AccordionItemHeading>
					<AccordionItemPanel>
						{ blocks
							.filter( ( block ) => block.category === category )
							.map( ( block ) => (
								<Block key={ block.name } { ...block } />
							) ) }
					</AccordionItemPanel>
				</AccordionItem>
			) ) }
		</Accordion>
	);
};

export default Blocks;

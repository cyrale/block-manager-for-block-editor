import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getBlock } from '../registered-blocks';
import BlockAccess from './block-access';
import BlockDescription from './block-description';
import BlockIcon from './block-icon';
import BlockStyles from './block-styles';
import BlockSupports from './block-supports';
import BlockVariations from './block-variations';

const { pick } = lodash;
const {
	i18n: { __ },
} = wp;

const panels = {
	supports: {
		label: __( 'Supports', 'bmfbe' ),
		Component: BlockSupports,
	},
	styles: {
		label: __( 'Styles', 'bmfbe' ),
		Component: BlockStyles,
	},
	variations: {
		label: __( 'Variations', 'bmfbe' ),
		Component: BlockVariations,
	},
	access: {
		label: __( 'Access', 'bmfbe' ),
		Component: BlockAccess,
	},
};

const Block = ( props ) => {
	const [ isLoading, setIsLoading ] = useState( true );

	const [ block, setBlock ] = useState( {} );
	useEffect( () => {
		const fetchBlock = async () => {
			setBlock( await getBlock( props.name ) );
			setIsLoading( false );
		};

		fetchBlock();
	}, [] );

	return (
		<div className="bmfbe-block">
			{
				( isLoading )
					? ( <div>Loading...</div> )
					: (
						<>
							<BlockIcon icon={ block.icon } />
							<BlockDescription
								{ ...pick( block, [ 'title', 'name', 'description' ] ) }
							/>
							<Accordion
								allowMultipleExpanded={ true }
								allowZeroExpanded={ true }
							>
							{ Object.entries( panels ).map(
								( [ key, { label, Component } ] ) => (
									<AccordionItem key={ key }>
										<AccordionItemHeading>
											<AccordionItemButton>
												{ label }
											</AccordionItemButton>
										</AccordionItemHeading>
										<AccordionItemPanel>
											<Component { ...{ [ key ]: block[ key ] } } />
										</AccordionItemPanel>
									</AccordionItem>
								)
							) }
							</Accordion>
						</>
					)
			}
		</div>
	);
};

export default Block;

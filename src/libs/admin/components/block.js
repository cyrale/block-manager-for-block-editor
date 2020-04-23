import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getBlock } from '../../registered-blocks';
import Access from './block/access';
import Description from './block/description';
import Icon from './block/icon';
import Styles from './block/styles';
import Supports from './block/supports';
import Variations from './block/variations';

const { pick } = lodash;
const {
	i18n: { __ },
} = wp;

const panels = {
	supports: {
		label: __( 'Supports', 'bmfbe' ),
		Component: Supports,
	},
	styles: {
		label: __( 'Styles', 'bmfbe' ),
		Component: Styles,
	},
	variations: {
		label: __( 'Variations', 'bmfbe' ),
		Component: Variations,
	},
	access: {
		label: __( 'Access', 'bmfbe' ),
		Component: Access,
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
			{ isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<Icon icon={ block.icon } />
					<Description
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
										<Component { ...block[ key ] } />
									</AccordionItemPanel>
								</AccordionItem>
							)
						) }
					</Accordion>
				</>
			) }
		</div>
	);
};

export default Block;

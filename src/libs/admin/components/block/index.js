import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getBlock } from '../../../registered-blocks';
import Access from './access';
import Description from './description';
import Icon from './icon';
import Styles from './styles';
import Supports from './supports';
import Variations from './variations';

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

	const handleSupportsOverride = () => {
		setBlock( { ...block, supportsOverride: ! block.supportsOverride } );
	};

	const handleOnSettingsChange = ( name, settings ) => {
		setBlock( { ...block, [ name ]: settings } );
	};

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
						{ Object.entries( panels )
							.filter(
								( [ key ] ) =>
									! Array.isArray( block[ key ] ) ||
									block[ key ].length > 0
							)
							.map( ( [ key, { label, Component } ] ) => (
								<AccordionItem key={ `${ block.name }/${ key }` }>
									{ 'supports' === key && (
										<input
											type="checkbox"
											checked={ block.supportsOverride }
											onChange={ handleSupportsOverride }
										/>
									) }
									<AccordionItemHeading>
										<AccordionItemButton>
											{ label }
										</AccordionItemButton>
									</AccordionItemHeading>
									<AccordionItemPanel>
										<Component
											onChange={ ( value ) => handleOnSettingsChange( key, value ) }

											{ ...{
												[ key ]: block[ key ],
												disabled:
													'supports' === key &&
													! block.supportsOverride,
											} }
										/>
									</AccordionItemPanel>
								</AccordionItem>
							) ) }
					</Accordion>
				</>
			) }
		</div>
	);
};

export default Block;

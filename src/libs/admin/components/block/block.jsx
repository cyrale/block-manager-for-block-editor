import { useMemo } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import useBlocks from '../../use-blocks';
import Supports from '../settings/supports';
import Toggle from '../settings/toggle';
import Access from './access';
import Description from './description';
import Icon from './icon';
import Styles from './styles';
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

export default function Block( { name } ) {
	const { getBlock, saveInProgress, updateBlock } = useBlocks();
	const block = getBlock( name );
	const inProgress = saveInProgress( name );

	function handleSupportsOverride() {
		updateBlock( {
			...block,
			supports_override: ! block.supports_override,
		} );
	}

	function handleOnSettingsChange( key, value ) {
		updateBlock( { ...block, [ key ]: value } );
	}

	return useMemo(
		() => (
			<div className="bmfbe-block">
				<Icon icon={ block.icon } />
				<Description
					saveInProgress={ inProgress }
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
						.map( ( [ key, { label, Component } ] ) => {
							return (
								<AccordionItem
									key={ `${ block.name }/${ key }` }
								>
									{ 'supports' === key && (
										<Toggle
											value={ block.supports_override }
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
											value={ block[ key ] }
											disabled={
												'supports' === key &&
												! block.supports_override
											}
											onChange={ ( value ) =>
												handleOnSettingsChange(
													key,
													value
												)
											}
										/>
									</AccordionItemPanel>
								</AccordionItem>
							);
						} ) }
				</Accordion>
			</div>
		),
		[ block, inProgress ]
	);
}

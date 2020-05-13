import { useMemo } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import useBlocks from '../../use-blocks';
import Supports from '../supports';
import Access from './access';
import Description from './description';
import Icon from './icon';
import { LabeledSettingsList, TitledSettingsList } from './settings-list';

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
		Component: LabeledSettingsList,
	},
	variations: {
		label: __( 'Variations', 'bmfbe' ),
		Component: TitledSettingsList,
	},
	access: {
		label: __( 'Access', 'bmfbe' ),
		Component: Access,
	},
};

const Block = ( { name } ) => {
	const { getBlock, getSavingStatus, updateBlock } = useBlocks();
	const block = getBlock( name );
	const savingStatus = getSavingStatus( name );

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
					{ ...{
						...pick( block, [ 'title', 'name', 'description' ] ),
						savingStatus,
					} }
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
										<input
											type="checkbox"
											checked={ block.supports_override }
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
											onChange={ ( value ) =>
												handleOnSettingsChange(
													key,
													value
												)
											}
											{ ...{
												settings: block[ key ],
												disabled:
													'supports' === key &&
													! block.supports_override,
											} }
										/>
									</AccordionItemPanel>
								</AccordionItem>
							);
						} ) }
				</Accordion>
			</div>
		),
		[ block, savingStatus ]
	);
};

export default Block;

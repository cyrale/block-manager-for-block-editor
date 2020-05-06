import { useMemo } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import Access from './access';
import Description from './description';
import Icon from './icon';
import Supports from './supports';
import useBlocks from '../../use-blocks';
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
		Component: TitledSettingsList,
	},
	variations: {
		label: __( 'Variations', 'bmfbe' ),
		Component: LabeledSettingsList,
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
		updateBlock( { ...block, supportsOverride: ! block.supportsOverride } );
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
													! block.supportsOverride,
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

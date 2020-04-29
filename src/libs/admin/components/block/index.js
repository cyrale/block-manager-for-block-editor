import { useMemo } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { blockFields } from '../../../registered-blocks';
import Access from './access';
import Description from './description';
import Icon from './icon';
import Supports from './supports';
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

const Block = ( props ) => {
	const block = pick( props, blockFields );
	const { onChange } = props;

	const handleSupportsOverride = () => {
		onChange( {
			...block,
			supportsOverride: ! block.supportsOverride,
		} );
	};

	const handleOnSettingsChange = ( name, settings ) => {
		onChange( { ...block, [ name ]: settings } );
	};

	return useMemo(
		() => (
			<div className="bmfbe-block">
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
		Object.values( block )
	);
};

export default Block;

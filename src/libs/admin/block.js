import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

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

const Block = ( props ) => (
	<div className="bmfbe-block">
		<BlockIcon icon={ props.icon } />
		<BlockDescription
			{ ...pick( props, [ 'title', 'name', 'description' ] ) }
		/>
		<Accordion allowMultipleExpanded={ true } allowZeroExpanded={ true }>
			{ Object.entries( panels ).map(
				( [ key, { label, Component } ] ) => (
					<AccordionItem key={ key }>
						<AccordionItemHeading>
							<AccordionItemButton>{ label }</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel>
							<Component { ...{ [ key ]: props[ key ] } } />
						</AccordionItemPanel>
					</AccordionItem>
				)
			) }
		</Accordion>
	</div>
);

export default Block;

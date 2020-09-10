import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { __ } from '@wordpress/i18n';

import InternalSupports from '../supports';
import ExternalLink from '../external-link';

export default function Supports( props ) {
	return (
		<Accordion allowZeroExpanded={ true }>
			<AccordionItem className="accordion__item accordion__item--supports">
				<AccordionItemHeading>
					<AccordionItemButton>
						{ __( 'Supports', 'bmfbe' ) }
						<ExternalLink link="https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional" />
					</AccordionItemButton>
				</AccordionItemHeading>
				<AccordionItemPanel>
					<InternalSupports { ...props } />
				</AccordionItemPanel>
			</AccordionItem>
		</Accordion>
	);
}

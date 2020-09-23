/**
 * External dependencies
 */
import {
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

export default function Category( { category, children, count = 0 } ) {
	return (
		<AccordionItem key={ category.slug } uuid={ category.slug }>
			<AccordionItemHeading>
				<AccordionItemButton>
					{ category.title }
					<em>({ count })</em>
				</AccordionItemButton>
			</AccordionItemHeading>
			<AccordionItemPanel>{ children }</AccordionItemPanel>
		</AccordionItem>
	);
}

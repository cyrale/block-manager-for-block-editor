/**
 * External dependencies
 */
import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PATTERNS_STORE } from '../../../stores/patterns/constants';
import Pattern from './pattern';

export default function Panel() {
	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	const { categories, patterns } = useSelect(
		( select ) => ( {
			categories: select( PATTERNS_STORE ).getPatternCategories(),
			patterns: select( PATTERNS_STORE ).getPatterns(),
		} ),
		[]
	);

	useEffect( () => {
		const defaultDisplayedCategories = {};

		categories.forEach( ( { name }, index ) => {
			defaultDisplayedCategories[ name ] = 0 === index;
		} );

		setDisplayedCategories( defaultDisplayedCategories );
	}, [ categories ] );

	/**
	 * Handle changes with accordion. Display or hide categories.
	 *
	 * @param {string[]} accordionNames Names of displayed categories.
	 * @since 1.0.0
	 */
	function handleAccordionChange( accordionNames ) {
		const currentDisplayedCategories = {};

		categories.forEach( ( { name } ) => {
			currentDisplayedCategories[ name ] = accordionNames.includes(
				name
			);
		} );

		setDisplayedCategories( currentDisplayedCategories );
	}

	return (
		<div className="bmfbe-patterns-panel">
			{ 0 === categories.length ? (
				<></>
			) : (
				<Accordion
					allowZeroExpanded={ true }
					preExpanded={ [ categories[ 0 ].name ] }
					onChange={ handleAccordionChange }
				>
					{ categories.map( ( category ) => {
						const categorizedPatterns = patterns.filter(
							( { categories: c } ) => c.includes( category.name )
						);

						if ( 0 === categorizedPatterns.length ) {
							return <Fragment key={ category.name } />;
						}

						return (
							<AccordionItem
								key={ category.name }
								uuid={ category.name }
							>
								<AccordionItemHeading>
									<AccordionItemButton>
										{ category.label }
										<em>
											({ categorizedPatterns.length })
										</em>
									</AccordionItemButton>
								</AccordionItemHeading>
								<AccordionItemPanel>
									{ displayedCategories[ category.name ] &&
										categorizedPatterns.map(
											( pattern ) => (
												<Pattern
													key={ pattern.name }
													{ ...pattern }
												/>
											)
										) }
								</AccordionItemPanel>
							</AccordionItem>
						);
					} ) }
				</Accordion>
			) }
		</div>
	);
}

/**
 * External dependencies
 */
import classnames from 'classnames';
import { mapValues, pick, uniq } from 'lodash';
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
import { select as wpSelect, useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BLOCKS_STORE } from '../../stores/blocks/constants';
import { SETTINGS_STORE } from '../../stores/settings/constants';
import Access from '../access';
import Description from './description';
import ExternalLink from '../external-link';
import FakeAccordion from '../fake-accordion';
import Icon from './icon';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import Styles from './styles';
import Supports from '../supports';
import Variations from './variations';
import useDelayedChanges from '../../hooks/use-delayed-changes';

/**
 * Panels to display below of block description.
 *
 * @constant {({name: string, label: string, Component: *})[]}
 * @since 1.0.0
 */
const panels = [
	{
		name: 'supports',
		label: __( 'Supports', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional',
		Component: Supports,
	},
	{
		name: 'styles',
		label: __( 'Styles', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#styles-optional',
		Component: Styles,
	},
	{
		name: 'variations',
		label: __( 'Variations', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#variations-optional',
		Component: Variations,
	},
	{
		name: 'access',
		label: __( 'Enable this block', 'bmfbe' ),
		Component: Access,
	},
];

/**
 * Default status for displayed panels (all hidden).
 *
 * @constant {Object.<string, boolean>}
 * @since 1.0.0
 */
const defaultDisplayedPanels = {};
panels.forEach( ( { name } ) => {
	defaultDisplayedPanels[ name ] = false;
} );

/**
 * List of all fields of a block that can be modified.
 *
 * @constant {string[]}
 * @since 1.0.0
 */
const changingFields = [
	...[ 'name', 'supports_override' ],
	...panels.map( ( panel ) => panel.name ),
];

export default function Block( { name: blockName } ) {
	// Status of panels: show/hide.
	const [ displayedPanels, setDisplayedPanels ] = useState(
		defaultDisplayedPanels
	);

	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
		[]
	);

	const block = useSelect(
		( select ) => select( BLOCKS_STORE ).getBlock( blockName ),
		[]
	);

	const { saveBlock, updateBlock } = useDispatch( BLOCKS_STORE );
	const { enqueueChanges, setInitialData } = useDelayedChanges( saveBlock );

	useEffect( () => {
		setInitialData( pick( block, changingFields ) );
	}, [] );

	// Get uniquely values for access panel.
	const uniqFlatValues = uniq(
		Object.values(
			mapValues( block.access, ( postTypeValues ) =>
				Object.values( postTypeValues )
			)
		).reduce( ( acc, values ) => [ ...acc, ...values ], [] )
	);

	// Display access panel or fake it?
	const displayGlobalActivation =
		! settings.limit_access_by_post_type &&
		! settings.limit_access_by_user_group;
	// Split value to be used by checkbox.
	const globalActivation = {
		checked: 1 === uniqFlatValues.length && uniqFlatValues[ 0 ],
		indeterminate: 1 < uniqFlatValues.length,
	};

	/**
	 * Handle changes with accordion. Display or hide panels.
	 *
	 * @param {string[]} accordionNames Names of displayed panels.
	 * @since 1.0.0
	 */
	function handleAccordionChange( accordionNames ) {
		const currentDisplayedPanels = mapValues(
			displayedPanels,
			( displayed, name ) => accordionNames.includes( name )
		);
		setDisplayedPanels( currentDisplayedPanels );
	}

	/**
	 * Handle changes on block settings.
	 *
	 * @param {Object} value New block settings.
	 * @since 1.0.0
	 */
	async function handleBlockChange( value ) {
		await updateBlock( blockName, value );

		const newBlock = wpSelect( BLOCKS_STORE ).getBlock( blockName );
		enqueueChanges( pick( newBlock, changingFields ) );
	}

	/**
	 * Handle changes with global checkbox for access panel.
	 *
	 * @param {boolean} value New access value for all properties.
	 * @since 1.0.0
	 */
	function handleOnGlobalAccessChange( value ) {
		const newAccess = mapValues( block.access, ( postTypeValues ) =>
			mapValues( postTypeValues, () => value )
		);

		handleBlockChange( {
			access: newAccess,
		} );
	}

	return (
		<div className="bmfbe-block">
			<div className="bmfbe-block__content">
				<Icon icon={ block.icon } />
				<Description
					name={ blockName }
					title={ block.title }
					description={ block.description }
				/>
			</div>
			<IndeterminateToggleControl
				label={ __( 'Override supports?', 'bmfbe' ) }
				className="bmfbe-block__override-supports"
				checked={ block.supports_override }
				onChange={ ( { checked } ) =>
					handleBlockChange( {
						supports_override: checked,
					} )
				}
			/>
			<Accordion
				allowMultipleExpanded={ true }
				allowZeroExpanded={ true }
				onChange={ handleAccordionChange }
			>
				{ panels
					.filter(
						( { name: panelName } ) =>
							// Hide empty panels.
							( ! Array.isArray( block[ panelName ] ) ||
								block[ panelName ].length > 0 ) &&
							// Hide supports panel.
							( 'supports' !== panelName ||
								block.supports_override ) &&
							// Hide access panels.
							( 'access' !== panelName ||
								! displayGlobalActivation )
					)
					.map( ( { label, link, name: panelName, Component } ) => (
						<AccordionItem
							key={ `${ blockName }/${ panelName }` }
							uuid={ panelName }
							className={ classnames(
								'accordion__item',
								`accordion__item--${ panelName }`
							) }
						>
							<AccordionItemHeading>
								<AccordionItemButton>
									{ 'access' === panelName && (
										<IndeterminateToggleControl
											onChange={ ( { checked } ) =>
												handleOnGlobalAccessChange(
													checked
												)
											}
											{ ...globalActivation }
										/>
									) }
									{ label }
									{ link && <ExternalLink link={ link } /> }
								</AccordionItemButton>
							</AccordionItemHeading>
							<AccordionItemPanel>
								{ displayedPanels[ panelName ] && (
									<Component
										value={ block[ panelName ] }
										disabled={
											'supports' === panelName &&
											! block.supports_override
										}
										onChange={ ( checked ) =>
											handleBlockChange( {
												[ panelName ]: checked,
											} )
										}
									/>
								) }
							</AccordionItemPanel>
						</AccordionItem>
					) ) }
			</Accordion>
			{ displayGlobalActivation && (
				<FakeAccordion>
					<IndeterminateToggleControl
						label={ __( 'Enable this block', 'bmfbe' ) }
						onChange={ ( { checked } ) =>
							handleOnGlobalAccessChange( checked )
						}
						{ ...globalActivation }
					/>
				</FakeAccordion>
			) }
		</div>
	);
}

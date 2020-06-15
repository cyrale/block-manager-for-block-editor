import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import Access from '../access';
import { BLOCKS_STORE } from '../../stores/blocks/constants';
import Checkbox from '../checkbox';
import Description from './description';
import FakeAccordion from '../fake-accordion';
import Icon from './icon';
import { SETTINGS_STORE } from '../../stores/settings/constants';
import Styles from './styles';
import Supports from '../supports';
import Toggle from '../toggle';
import Variations from './variations';
import useDelayedChanges from '../../hooks/use-delayed-changes';

const { mapValues, pick, uniq } = lodash;
const {
	data: { select: wpSelect, useDispatch, useSelect },
	element: { useEffect, useState },
	i18n: { __ },
} = wp;

const panels = [
	{
		name: 'supports',
		label: __( 'Supports', 'bmfbe' ),
		Component: Supports,
	},
	{
		name: 'styles',
		label: __( 'Styles', 'bmfbe' ),
		Component: Styles,
	},
	{
		name: 'variations',
		label: __( 'Variations', 'bmfbe' ),
		Component: Variations,
	},
	{
		name: 'access',
		label: __( 'Enabled', 'bmfbe' ),
		Component: Access,
	},
];

const defaultDisplayedPanels = {};
panels.forEach( ( { name } ) => {
	defaultDisplayedPanels[ name ] = false;
} );

const changingFields = [
	...[ 'name', 'supports_override' ],
	...panels.map( ( panel ) => panel.name ),
];

export default function Block( { name: blockName } ) {
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

	const uniqFlatValues = uniq(
		Object.values(
			mapValues( block.access, ( postTypeValues ) =>
				Object.values( postTypeValues )
			)
		).reduce( ( acc, values ) => [ ...acc, ...values ], [] )
	);

	const displayGlobalActivation =
		! settings.limit_access_by_post_type &&
		! settings.limit_access_by_user_group;
	const globalActivation = {
		checked: 1 === uniqFlatValues.length && uniqFlatValues[ 0 ],
		indeterminate: 1 < uniqFlatValues.length,
	};

	useEffect( () => {
		setInitialData( pick( block, changingFields ) );
	}, [] );

	function handleAccordionChange( items ) {
		const currentDisplayedPanels = mapValues(
			displayedPanels,
			( displayed, name ) => items.includes( name )
		);
		setDisplayedPanels( currentDisplayedPanels );
	}

	async function handleBlockChange( value ) {
		await updateBlock( blockName, value );

		const newBlock = wpSelect( BLOCKS_STORE ).getBlock( blockName );
		enqueueChanges( pick( newBlock, changingFields ) );
	}

	function handleOnGlobalAccessChange( value ) {
		const newAccess = mapValues( block.access, ( postTypeValues ) =>
			mapValues( postTypeValues, () => value )
		);

		handleBlockChange( {
			access: newAccess,
		} );
	}

	async function handleOnSettingsChange( key, value ) {
		handleBlockChange( {
			[ key ]: value,
		} );
	}

	return (
		<div className="bmfbe-block">
			<Icon icon={ block.icon } />
			<Description
				name={ blockName }
				title={ block.title }
				description={ block.description }
			/>
			<Toggle
				label={ __( 'Override supports?', 'bmfbe' ) }
				checked={ block.supports_override }
				onChange={ () =>
					handleOnSettingsChange(
						'supports_override',
						! block.supports_override
					)
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
							// Hide access panels.
							( 'access' !== panelName ||
								! displayGlobalActivation )
					)
					.map( ( { label, name: panelName, Component } ) => (
						<AccordionItem
							key={ `${ blockName }/${ panelName }` }
							uuid={ panelName }
						>
							<AccordionItemHeading>
								<AccordionItemButton>
									{ 'access' === panelName && (
										<Checkbox
											onChange={ ( e ) =>
												handleOnGlobalAccessChange(
													e.target.checked
												)
											}
											{ ...globalActivation }
										/>
									) }
									{ label }
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
											handleOnSettingsChange(
												panelName,
												checked
											)
										}
									/>
								) }
							</AccordionItemPanel>
						</AccordionItem>
					) ) }
			</Accordion>
			{ displayGlobalActivation && (
				<FakeAccordion>
					<Checkbox
						onChange={ ( e ) =>
							handleOnGlobalAccessChange( e.target.checked )
						}
						{ ...globalActivation }
					/>
					{ __( 'Enabled', 'bmfbe' ) }
				</FakeAccordion>
			) }
		</div>
	);
}

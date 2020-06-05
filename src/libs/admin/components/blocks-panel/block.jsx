import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import useDelayedChanges from '../../hooks/use-delayed-changes';
import { BLOCKS_STORE } from '../../stores/blocks/constants';
import Access from '../access';
import Checkbox from '../checkbox';
import Supports from '../supports';
import Toggle from '../toggle';
import Description from './description';
import Icon from './icon';
import Styles from './styles';
import Variations from './variations';
import { SETTINGS_STORE } from '../../stores/settings/constants';

const { mapValues, pick, uniq } = lodash;
const {
	data: { select: wpSelect, useDispatch, useSelect },
	element: { useEffect },
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
		label: __( 'Access', 'bmfbe' ),
		Component: Access,
	},
];

const changingFields = [
	...[ 'name', 'supports_override' ],
	...panels.map( ( panel ) => panel.name ),
];

export default function Block( { name: blockName } ) {
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
		checked: 1 === uniqFlatValues.length,
		indeterminate: 1 < uniqFlatValues.length,
	};

	useEffect( () => {
		setInitialData( pick( block, changingFields ) );
	}, [] );

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
			{ displayGlobalActivation && (
				<Checkbox
					onChange={ ( e ) =>
						handleOnGlobalAccessChange( e.target.checked )
					}
					{ ...globalActivation }
				/>
			) }
			<Icon icon={ block.icon } />
			<Description
				name={ blockName }
				title={ block.title }
				description={ block.description }
			/>
			<Accordion
				allowMultipleExpanded={ true }
				allowZeroExpanded={ true }
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
					.map( ( { label, name: panelName, Component } ) => {
						return (
							<AccordionItem
								key={ `${ blockName }/${ panelName }` }
							>
								{ 'supports' === panelName && (
									<Toggle
										checked={ block.supports_override }
										onChange={ () =>
											handleOnSettingsChange(
												'supports_override',
												! block.supports_override
											)
										}
									/>
								) }
								<AccordionItemHeading>
									<AccordionItemButton>
										{ label }
									</AccordionItemButton>
								</AccordionItemHeading>
								<AccordionItemPanel>
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
								</AccordionItemPanel>
							</AccordionItem>
						);
					} ) }
			</Accordion>
		</div>
	);
}

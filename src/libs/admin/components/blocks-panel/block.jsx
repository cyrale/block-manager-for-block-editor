import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import useDelayedChanges from '../../hooks/use-delayed-changes';
import { BLOCKS_STORE } from '../../stores/blocks/constants';
import Access from '../access';
import Supports from '../supports';
import Toggle from '../toggle';
import Description from './description';
import Icon from './icon';
import Styles from './styles';
import Variations from './variations';
import { SETTINGS_STORE } from '../../stores/settings/constants';

const { pick } = lodash;
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

	useEffect( () => {
		setInitialData( pick( block, changingFields ) );
	}, [] );

	async function handleOnSettingsChange( key, value ) {
		await updateBlock( blockName, {
			[ key ]: value,
		} );

		const newBlock = wpSelect( BLOCKS_STORE ).getBlock( blockName );
		enqueueChanges( pick( newBlock, changingFields ) );
	}

	return (
		<div className="bmfbe-block">
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
								settings.limit_access_by_post_type ||
								settings.limit_access_by_user_group )
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

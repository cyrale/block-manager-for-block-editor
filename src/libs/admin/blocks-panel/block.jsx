import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import Supports from '../components/supports';
import Toggle from '../components/toggle';
import useDelayedChanges from '../use-delayed-changes';
import Access from './access';
import Description from './description';
import Icon from './icon';
import Styles from './styles';
import { BLOCKS_PANEL_STORE } from './store/constants';
import Variations from './variations';

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
	const block = useSelect(
		( select ) => select( BLOCKS_PANEL_STORE ).getBlock( blockName ),
		[]
	);

	const { saveBlock, updateBlock } = useDispatch( BLOCKS_PANEL_STORE );
	const { enqueueChanges, setInitialData } = useDelayedChanges( saveBlock );

	useEffect( () => {
		setInitialData( pick( block, changingFields ) );
	}, [] );

	async function handleOnSettingsChange( key, value ) {
		await updateBlock( blockName, {
			[ key ]: value,
		} );

		const newBlock = wpSelect( BLOCKS_PANEL_STORE ).getBlock( blockName );
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
							! Array.isArray( block[ panelName ] ) ||
							block[ panelName ].length > 0
					)
					.map( ( { label, name: panelName, Component } ) => {
						return (
							<AccordionItem
								key={ `${ blockName }/${ panelName }` }
							>
								{ 'supports' === panelName && (
									<Toggle
										value={ block.supports_override }
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
										onChange={ ( value ) =>
											handleOnSettingsChange(
												panelName,
												value
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

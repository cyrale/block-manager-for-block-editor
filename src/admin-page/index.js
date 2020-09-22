/**
 * External dependencies
 */
import { Redirect, useLocation } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ITEM_STORE as SETTINGS_STORE } from '../stores/settings/constants';
import {
	default as BlocksPanel,
	TabTitle as BlocksTab,
} from './components/blocks-panel';
import {
	default as PatternsPanel,
	TabTitle as PatternsTab,
} from './components/patterns-panel';
import {
	default as SettingsPanel,
	TabTitle as SettingsTab,
} from './components/settings-panel';
import ContentLayout from './components/content-layout';
import SaveContents from './components/save-contents';
import StickyFooter from './components/sticky-footer';

const panels = [
	{
		path: '/settings',
		label: __( 'Settings', 'bmfbe' ),
		Tab: SettingsTab,
		Panel: SettingsPanel,
	},
	{
		path: '/blocks',
		label: __( 'Blocks', 'bmfbe' ),
		Tab: BlocksTab,
		Panel: BlocksPanel,
	},
	{
		path: '/patterns',
		label: __( 'Patterns', 'bmfbe' ),
		Tab: PatternsTab,
		Panel: PatternsPanel,
		visible: ( settings ) => false === settings.disable_block_patterns,
	},
];

export default function AdminPage() {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getItem(),
		[]
	);

	const paths = panels.map( ( { path } ) => path );
	const location = useLocation();

	if ( ! paths.includes( location.pathname ) ) {
		return <Redirect to={ paths[ 0 ] } push={ false } />;
	}

	const activePanels = panels.filter(
		( panel ) => undefined === panel.visible || panel.visible( settings )
	);

	const tabIndex = activePanels.reduce( ( index, panel, i ) => {
		if ( location.pathname === panel.path ) {
			index = i;
		}

		return index;
	}, 0 );

	return (
		<>
			<Tabs
				forceRenderTabPanel={ true }
				selectedIndex={ tabIndex }
				onSelect={ () => {} }
			>
				<TabList>
					{ activePanels.map( ( { path, label, Tab: PanelTab } ) => (
						<Tab key={ path }>
							<PanelTab to={ path }>{ label }</PanelTab>
						</Tab>
					) ) }
				</TabList>
				{ activePanels.map( ( { path, Panel } ) => (
					<TabPanel key={ path }>
						<ContentLayout>
							<Panel />
						</ContentLayout>
					</TabPanel>
				) ) }
			</Tabs>
			<StickyFooter>
				<SaveContents />
			</StickyFooter>
		</>
	);
}

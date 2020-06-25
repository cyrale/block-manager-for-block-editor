import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { __ } from '@wordpress/i18n';

import {
	default as BlocksPanel,
	TabTitle as BlocksTab,
} from './components/blocks-panel';
import {
	default as SettingsPanel,
	TabTitle as SettingsTab,
} from './components/settings-panel';

export default function Admin() {
	return (
		<Tabs forceRenderTabPanel={ true }>
			<TabList>
				<Tab>
					<SettingsTab>{ __( 'Settings', 'bmfbe' ) }</SettingsTab>
				</Tab>
				<Tab>
					<BlocksTab>{ __( 'Blocks', 'bmfbe' ) }</BlocksTab>
				</Tab>
			</TabList>
			<TabPanel>
				<SettingsPanel />
			</TabPanel>
			<TabPanel>
				<BlocksPanel />
			</TabPanel>
		</Tabs>
	);
}

import {
	default as BlocksPanel,
	TabTitle as BlocksTab,
} from './components/blocks-panel';
import {
	default as SettingsPanel,
	TabTitle as SettingsTab,
} from './components/settings-panel';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const {
	i18n: { __ },
} = wp;

function Admin() {
	return (
		<Tabs forceRenderTabPanel={ true }>
			<TabList>
				<Tab>
					<BlocksTab>{ __( 'Blocks', 'bmfbe' ) }</BlocksTab>
				</Tab>
				<Tab>
					<SettingsTab>{ __( 'Settings', 'bmfbe' ) }</SettingsTab>
				</Tab>
			</TabList>
			<TabPanel>
				<BlocksPanel />
			</TabPanel>
			<TabPanel>
				<SettingsPanel />
			</TabPanel>
		</Tabs>
	);
}

export default Admin;

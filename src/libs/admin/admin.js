import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BlocksPanel from './components/blocks-panel';
import SettingsPanel from './components/settings-panel';

const {
	i18n: { __ },
} = wp;

const Admin = () => (
	<Tabs forceRenderTabPanel={ true }>
		<TabList>
			<Tab>{ __( 'Blocks', 'bmfbe' ) }</Tab>
			<Tab>{ __( 'Settings', 'bmfbe' ) }</Tab>
		</TabList>
		<TabPanel>
			<BlocksPanel />
		</TabPanel>
		<TabPanel>
			<SettingsPanel />
		</TabPanel>
	</Tabs>
);

export default Admin;

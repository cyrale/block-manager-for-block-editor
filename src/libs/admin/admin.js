import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Blocks from './components/blocks';
import Settings from './components/settings';
import { BlocksProvider } from './blocks-context';

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
			<BlocksProvider>
				<Blocks />
			</BlocksProvider>
		</TabPanel>
		<TabPanel>
			<Settings />
		</TabPanel>
	</Tabs>
);

export default Admin;

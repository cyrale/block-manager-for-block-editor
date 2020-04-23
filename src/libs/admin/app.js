import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Blocks from './components/blocks';
import Settings from './components/settings';

const { i18n } = wp;
const { __ } = i18n;

const App = () => (
	<Tabs>
		<TabList>
			<Tab>{ __( 'Blocks', 'bmfbe' ) }</Tab>
			<Tab>{ __( 'Settings', 'bmfbe' ) }</Tab>
		</TabList>
		<TabPanel>
			<Blocks />
		</TabPanel>
		<TabPanel>
			<Settings />
		</TabPanel>
	</Tabs>
);

export default App;

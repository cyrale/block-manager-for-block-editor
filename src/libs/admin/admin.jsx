import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import BlocksPanel from './components/blocks-panel';
import SettingsPanel, { TabTitle as SettingsTabTitle } from './settings-panel';
import { BlocksProvider } from './blocks-context';
import useBlocks from './use-blocks';

const {
	i18n: { __ },
} = wp;

function TabTitle( { children, useHook } ) {
	const { loadInProgress, saveInProgress } = useHook();

	return (
		<>
			{ children }
			{ loadInProgress() && 'Loading...' }
			{ saveInProgress() && 'Saving...' }
		</>
	);
}

function Admin() {
	return (
		<BlocksProvider>
			<Tabs forceRenderTabPanel={ true }>
				<TabList>
					<Tab>
						<TabTitle useHook={ useBlocks }>
							{ __( 'Blocks', 'bmfbe' ) }
						</TabTitle>
					</Tab>
					<Tab>
						<SettingsTabTitle>
							{ __( 'Settings', 'bmfbe' ) }
						</SettingsTabTitle>
					</Tab>
				</TabList>
				<TabPanel>
					<BlocksPanel />
				</TabPanel>
				<TabPanel>
					<SettingsPanel />
				</TabPanel>
			</Tabs>
		</BlocksProvider>
	);
}

export default Admin;

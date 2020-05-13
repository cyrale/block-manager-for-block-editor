import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import BlocksPanel from './components/blocks-panel';
import SettingsPanel from './components/settings-panel';
import { BlocksProvider } from './blocks-context';
import { SettingsProvider } from './settings-context';
import useBlocks from './use-blocks';
import useSettings from './use-settings';

const {
	i18n: { __ },
} = wp;

const TabTitle = ( { children, useHook } ) => {
	const { loadInProgress, saveInProgress } = useHook();

	return (
		<>
			{ children }
			{ loadInProgress() && 'Loading...' }
			{ saveInProgress() && 'Saving...' }
		</>
	);
};

const Admin = () => {
	return (
		<SettingsProvider>
			<BlocksProvider>
				<Tabs forceRenderTabPanel={ true }>
					<TabList>
						<Tab>
							<TabTitle useHook={ useBlocks }>
								{ __( 'Blocks', 'bmfbe' ) }
							</TabTitle>
						</Tab>
						<Tab>
							<TabTitle useHook={ useSettings }>
								{ __( 'Settings', 'bmfbe' ) }
							</TabTitle>
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
		</SettingsProvider>
	);
};

export default Admin;

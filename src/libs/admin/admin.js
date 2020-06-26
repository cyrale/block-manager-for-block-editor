/**
 * External dependencies
 */
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BLOCKS_STORE } from './stores/blocks/constants';
import { SETTINGS_STORE } from './stores/settings/constants';
import { STATUS_PENDING, STATUS_SAVING } from './stores/constants';
import {
	default as BlocksPanel,
	TabTitle as BlocksTab,
} from './components/blocks-panel';
import Notice from './components/notice';
import {
	default as SettingsPanel,
	TabTitle as SettingsTab,
} from './components/settings-panel';

export default function Admin() {
	const status = useSelect( ( select ) =>
		STATUS_SAVING === select( BLOCKS_STORE ).getStatus() ||
		STATUS_SAVING === select( SETTINGS_STORE ).getStatus()
			? STATUS_SAVING
			: STATUS_PENDING
	);

	return (
		<>
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
			<Notice status={ status } />
		</>
	);
}

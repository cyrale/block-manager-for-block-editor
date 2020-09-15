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

export default function AdminPage() {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getItem(),
		[]
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
					{ false === settings.disable_block_patterns && (
						<Tab>
							<PatternsTab>
								{ __( 'Patterns', 'bmfbe' ) }
							</PatternsTab>
						</Tab>
					) }
				</TabList>
				<TabPanel>
					<SettingsPanel />
				</TabPanel>
				<TabPanel>
					<BlocksPanel />
				</TabPanel>
				{ false === settings.disable_block_patterns && (
					<TabPanel>
						<PatternsPanel />
					</TabPanel>
				) }
			</Tabs>
		</>
	);
}

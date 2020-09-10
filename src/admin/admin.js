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
import { BLOCKS_STORE } from '../stores/blocks/constants';
import { PATTERNS_STORE } from '../stores/patterns/constants';
import { SETTINGS_STORE } from '../stores/settings/constants';
import { STATUS_PENDING, STATUS_SAVING } from '../stores/constants';
import {
	default as BlocksPanel,
	TabTitle as BlocksTab,
} from './components/blocks-panel';
import Notice from './components/notice';
import {
	default as PatternsPanel,
	TabTitle as PatternsTab,
} from './components/patterns-panel';
import {
	default as SettingsPanel,
	TabTitle as SettingsTab,
} from './components/settings-panel';

export default function Admin() {
	const status = useSelect( ( select ) =>
		STATUS_SAVING === select( BLOCKS_STORE ).getStatus() ||
		STATUS_SAVING === select( PATTERNS_STORE ).getStatus() ||
		STATUS_SAVING === select( SETTINGS_STORE ).getStatus()
			? STATUS_SAVING
			: STATUS_PENDING
	);

	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
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
			<Notice status={ status } />
		</>
	);
}

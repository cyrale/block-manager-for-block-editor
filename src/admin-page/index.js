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
import { COLLECTION_STORE as BLOCKS_STORE } from '../stores/blocks/constants';
import { COLLECTION_STORE as PATTERNS_STORE } from '../stores/patterns/constants';
import { ITEM_STORE as SETTINGS_STORE } from '../stores/settings/constants';
import { STATUS_PENDING, STATUS_SAVING } from '../stores/common/constants';
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

export default function AdminPage() {
	const status = useSelect( ( select ) =>
		STATUS_SAVING === select( BLOCKS_STORE ).getStatus() ||
		STATUS_SAVING === select( PATTERNS_STORE ).getStatus() ||
		STATUS_SAVING === select( SETTINGS_STORE ).getStatus()
			? STATUS_SAVING
			: STATUS_PENDING
	);

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
			<Notice status={ status } />
		</>
	);
}

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
import ContentLayout from './components/content-layout';
import SaveContents from './components/save-contents';
import StickyFooter from './components/sticky-footer';

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
					<ContentLayout>
						<SettingsPanel />
					</ContentLayout>
				</TabPanel>
				<TabPanel>
					<ContentLayout>
						<BlocksPanel />
					</ContentLayout>
				</TabPanel>
				{ false === settings.disable_block_patterns && (
					<TabPanel>
						<ContentLayout>
							<PatternsPanel />
						</ContentLayout>
					</TabPanel>
				) }
			</Tabs>
			<StickyFooter>
				<SaveContents />
			</StickyFooter>
		</>
	);
}

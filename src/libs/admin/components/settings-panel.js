import Settings from './settings';
import { SettingsProvider } from '../settings-context';

const SettingsPanel = () => (
	<SettingsProvider>
		<Settings />
	</SettingsProvider>
);

export default SettingsPanel;

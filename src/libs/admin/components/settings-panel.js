import Settings from './settings';
import { SettingsProvider } from '../settings-context';

const SettingsPanel = () => {
	return (
		<SettingsProvider>
			<div className="bmfbe-settings">
				<Settings />
			</div>
		</SettingsProvider>
	);
};

export default SettingsPanel;

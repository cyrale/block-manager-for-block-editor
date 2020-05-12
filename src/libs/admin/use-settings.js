import { useContext } from 'react';

import { SettingsContext } from './settings-context';

const useSettings = () => {
	const [ state ] = useContext( SettingsContext );

	function getSettings() {
		return state.settings;
	}

	function updateSettings( settings ) {
		// console.log( settings );
	}

	return {
		getSettings,
		updateSettings,
	};
};

export default useSettings;

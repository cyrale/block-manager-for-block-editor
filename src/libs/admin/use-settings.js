import { useContext } from 'react';

import { SettingsContext } from './settings-context';

const useSettings = () => {
	const [ state, setState ] = useContext( SettingsContext );

	function getSettings() {
		return state.settings;
	}

	function updateSettings( settings ) {
		setState( ( prevState ) => ( {
			...prevState,
			settings: { ...prevState.settings, ...settings },
		} ) );
	}

	return {
		getSettings,
		updateSettings,
	};
};

export default useSettings;

import { SettingsContext } from './settings-context';

const {
	element: { useContext },
} = wp;

const useSettings = () => {
	const [ state, setState ] = useContext( SettingsContext );

	function getSettings() {
		return state.settings;
	}

	function loadInProgress() {
		return ! state.isLoaded;
	}

	function saveInProgress() {
		return state.savingQueue.length > 0 && state.savingQueue[ 0 ].isSaving;
	}

	function updateSettings( settings ) {
		setState( ( prevState ) => ( {
			...prevState,
			settings: { ...prevState.settings, ...settings },
		} ) );
	}

	return {
		getSettings,
		loadInProgress,
		saveInProgress,
		updateSettings,
	};
};

export default useSettings;

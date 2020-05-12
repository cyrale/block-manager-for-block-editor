import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getSettings } from '../api-settings';

const initialState = {
	isLoaded: false,
	settings: {},
	initialSettings: {},
	savingTimeout: undefined,
};

const SettingsContext = React.createContext( [ initialState, () => {} ] );

const SettingsProvider = ( props ) => {
	const [ state, setState ] = useState( initialState );

	// Get settings from API.
	useEffect( () => {
		const fetchSettings = async () => {
			const currentSettings = await getSettings();

			setState( ( prevState ) => ( {
				...prevState,
				settings: currentSettings,
				initialSettings: cloneDeep( currentSettings ),
				isLoaded: true,
			} ) );
		};

		fetchSettings();
	}, [] );

	return (
		<SettingsContext.Provider value={ [ state, setState ] }>
			{ props.children }
		</SettingsContext.Provider>
	);
};

export { SettingsContext, SettingsProvider };

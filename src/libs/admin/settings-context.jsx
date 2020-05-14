import { cloneDeep, isEmpty, isEqual, omit } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getSettings, updateSettings } from '../api-settings';

const initialState = {
	isLoaded: false,
	settings: {},
	initialSettings: {},
	savingQueue: [],
	savingTimeout: undefined,
};

const SettingsContext = React.createContext( [ initialState, () => {} ] );

function SettingsProvider( props ) {
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

	// Enqueue modifications to delay treatments.
	useEffect( () => {
		if ( ! isEmpty( state.settings ) ) {
			const savingSettings = {
				...cloneDeep( state.settings ),
				isSaving: false,
			};

			const firstSettings =
				state.savingQueue.length > 0
					? omit( state.savingQueue[ 0 ], [ 'isSaving' ] )
					: undefined;

			if (
				state.savingQueue.length === 1 &&
				! state.savingQueue[ 0 ].isSaving &&
				! isEqual( state.settings, state.initialSettings )
			) {
				// Replace first modification during waiting time.
				state.savingQueue[ 0 ] = savingSettings;
			} else if (
				( state.savingQueue.length === 2 &&
					isEqual( firstSettings, state.settings ) ) ||
				( state.savingQueue.length === 1 &&
					! state.savingQueue[ 0 ].isSaving &&
					isEqual( state.settings, state.initialSettings ) )
			) {
				// Remove modification if finally there is no modification.
				state.savingQueue.pop();
			} else if (
				( state.savingQueue.length === 0 &&
					! isEqual( state.settings, state.initialSettings ) ) ||
				( state.savingQueue.length === 1 &&
					! isEqual( state.settings, firstSettings ) )
			) {
				// Enqueue modification.
				state.savingQueue.push( savingSettings );
			} else if ( state.savingQueue.length === 2 ) {
				// Replace second modification in queue.
				state.savingQueue[ 1 ] = savingSettings;
			}

			setState( ( prevState ) => ( {
				...prevState,
				savingQueue: [ ...state.savingQueue ],
			} ) );
		}
	}, [ state.settings ] );

	// Treat modifications with delay.
	useEffect( () => {
		// Reset delayed treatment.
		if ( state.savingQueue.length === 0 ) {
			clearTimeout( state.savingTimeout );
		}

		// Delay treatment of enqueued modifications.
		if (
			state.savingQueue.length > 0 &&
			! state.savingQueue[ 0 ].isSaving
		) {
			delaySendingSettingsToAPI();
		}
	}, [ state.savingQueue ] );

	async function delaySendingSettingsToAPI() {
		await delayForSettings( 2000 );
		return sendSettingsToAPI();
	}

	function delayForSettings( ms ) {
		if ( Number.isInteger( state.savingTimeout ) ) {
			clearTimeout( state.savingTimeout );
		}

		return new Promise( ( resolve ) => {
			const newTimeoutID = setTimeout( () => {
				setState( ( prevState ) => ( {
					...prevState,
					savingTimeout: undefined,
				} ) );

				resolve();
			}, ms );

			setState( ( prevState ) => ( {
				...prevState,
				savingTimeout: newTimeoutID,
			} ) );
		} );
	}

	async function sendSettingsToAPI() {
		// const savingQueue = state.savingQueue[ 0 ];

		state.savingQueue[ 0 ].isSaving = true;

		setState( ( prevState ) => ( {
			...prevState,
			savingQueues: { ...state.savingQueue },
		} ) );

		const newSettings = await updateSettings(
			omit( state.savingQueue[ 0 ], [ 'isSaving' ] )
		);

		state.savingQueue.pop();

		if ( state.savingQueue.length > 0 ) {
			await sendSettingsToAPI();
		}

		setState( ( prevState ) => ( {
			...prevState,
			initialSettings: {
				...prevState.initialSettings,
				...newSettings,
			},
			savingQueue: [ ...state.savingQueue ],
		} ) );
	}

	return (
		<SettingsContext.Provider value={ [ state, setState ] }>
			{ props.children }
		</SettingsContext.Provider>
	);
}

export { SettingsContext, SettingsProvider };

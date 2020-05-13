import { useContext } from 'react';

import { BlocksContext } from './blocks-context';

const useBlocks = () => {
	const [ state, setState ] = useContext( BlocksContext );

	function getBlocks() {
		return Object.values( state.blocks );
	}

	function getBlock( name ) {
		return state.blocks[ name ];
	}

	function loadInProgress() {
		return ! state.isLoaded;
	}

	function saveInProgress( name = '' ) {
		if ( '' !== name ) {
			const savingQueue = state.savingQueues[ name ] ?? [];
			return savingQueue.length > 0 && savingQueue[ 0 ].isSaving;
		}

		return Object.values( state.savingQueues ).reduce(
			( inProgress, savingQueue ) => {
				return (
					inProgress ||
					( savingQueue.length > 0 && savingQueue[ 0 ].isSaving )
				);
			},
			false
		);
	}

	function updateBlock( block ) {
		setState( ( prevState ) => ( {
			...prevState,
			blocks: { ...prevState.blocks, [ block.name ]: block },
		} ) );
	}

	return {
		getBlocks,
		getBlock,
		loadInProgress,
		saveInProgress,
		updateBlock,
	};
};

export default useBlocks;

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

	function getSavingStatus( name ) {
		const savingQueue = state.savingQueues[ name ] ?? [];
		return savingQueue.length > 0 && savingQueue[ 0 ].isSaving;
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
		getSavingStatus,
		updateBlock,
	};
};

export default useBlocks;

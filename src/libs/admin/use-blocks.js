import { useContext } from 'react';

import { BlocksContext } from './blocks-context';

const useBlocks = () => {
	const [ state, setState ] = useContext( BlocksContext );

	const getBlocksList = () => {
		return Object.values( state.blocks );
	};

	const getBlock = ( name ) => {
		return state.blocks[ name ];
	};

	const getSavingStatus = ( name ) => {
		const savingQueue = state.savingQueues[ name ] ?? [];
		return savingQueue.length > 0 && savingQueue[ 0 ].isSaving;
	};

	const updateBlock = ( block ) => {
		setState( ( prevState ) => ( {
			...prevState,
			blocks: { ...prevState.blocks, [ block.name ]: block },
		} ) );
	};

	return {
		getBlocksList,
		getBlock,
		getSavingStatus,
		updateBlock,
	};
};

export default useBlocks;

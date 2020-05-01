import { useContext } from 'react';

import { BlocksContext } from './blocks-context';

const useBlocks = () => {
	const [ state, setState ] = useContext( BlocksContext );

	function getBlocksList() {
		return Object.values( state.blocks );
	}

	function getBlock( name ) {
		return state.blocks[ name ];
	}

	function updateBlock( block ) {
		setState( ( prevState ) => {
			prevState.blocks = { ...prevState.blocks, [ block.name ]: block };
			return { ...prevState };
		} );
	}

	return {
		getBlocksList,
		getBlock,
		updateBlock,
	};
};

export default useBlocks;

import { allBlocks, updateBlock } from '../../api/blocks';

export function API_FETCH_ALL() {
	return allBlocks();
}

export function SAVE_BLOCK( { block } ) {
	return updateBlock( block );
}

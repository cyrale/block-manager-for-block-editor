import { useMemo } from 'react';
import Block from './block';

const BlockList = ( { blocks, onChange } ) => {
	return useMemo(
		() => (
			<div className="bmfbe-blocks-list">
				{ blocks.map( ( block ) => (
					<Block
						key={ block.name }
						onChange={ onChange }
						{ ...block }
					/>
				) ) }
			</div>
		),
		blocks
	);
};

export default BlockList;

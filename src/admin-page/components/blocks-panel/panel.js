/**
 * WordPress dependencies
 */
import { select as wpSelect, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { COLLECTION_STORE as BLOCKS_STORE } from '../../../stores/blocks/constants';
import GenericPanel from '../panel';
import Block from './block';

export default function Panel() {
	const { blocks, categories, status } = useSelect( ( select ) => {
		const store = select( BLOCKS_STORE );

		return {
			blocks: store.getCollection(),
			categories: store.getCategories(),
			status: store.getStatus(),
		};
	}, [] );

	return (
		<GenericPanel
			className="bmfbe-blocks-panel"
			categories={ categories }
			items={ blocks.map( ( { name } ) =>
				wpSelect( BLOCKS_STORE ).getItem( name )
			) }
			status={ status }
			labels={ {
				searchForm: __( 'Search for a block', 'bmfbe' ),
				notFound: __( 'Block not found.', 'bmfbe' ),
			} }
		>
			{ blocks.map( ( block ) => (
				<Block key={ block.name } { ...block } />
			) ) }
		</GenericPanel>
	);
}

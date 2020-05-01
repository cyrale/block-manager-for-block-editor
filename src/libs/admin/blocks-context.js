import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getPagedRegisteredBlocks } from '../registered-blocks';

const initialState = {
	isLoaded: false,
	blocks: {},
	blocksPage: 1,
	blocksTotalPages: 1,
	initialBlocks: {},
};

const BlocksContext = React.createContext( [ initialState, () => {} ] );

const BlocksProvider = ( props ) => {
	const [ state, setState ] = useState( initialState );

	useEffect( () => {
		const fetchBlocks = async () => {
			const currentBlocks = state.blocks;

			let currentPage = state.blocksPage;
			let currentTotalPages = state.blocksTotalPages;

			while ( currentPage <= currentTotalPages ) {
				const res = await getPagedRegisteredBlocks(
					{
						per_page: 100,
						page: currentPage,
						// _fields: [ 'name', 'category' ],
					},
					{ parse: false }
				);

				if ( res.status !== 200 ) {
					return;
				}

				// Update total of pages.
				currentTotalPages = Number(
					res.headers.get( 'x-wp-totalpages' )
				);
				if (
					state.blocksTotalPages === 1 &&
					state.blocksTotalPages !== currentTotalPages
				) {
					setState( {
						...state,
						blocksTotalPages: currentTotalPages,
					} );
				}

				// Add blocks to global list.
				( await res.json() ).forEach( ( block ) => {
					currentBlocks[ block.name ] = block;
				} );

				// Update page counter.
				currentPage++;
				setState( { ...state, blocksPage: currentPage } );
			}

			setState( {
				...state,
				blocks: currentBlocks,
				initialBlocks: cloneDeep( currentBlocks ),
				isLoaded: true,
			} );
		};

		fetchBlocks();
	}, [] );

	return (
		<BlocksContext.Provider value={ [ state, setState ] }>
			{ props.children }
		</BlocksContext.Provider>
	);
};

export { BlocksContext, BlocksProvider };

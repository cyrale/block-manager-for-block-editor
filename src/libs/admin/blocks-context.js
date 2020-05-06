import { cloneDeep, isEmpty, isEqual, omit, pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import { blockFields, getPagedRegisteredBlocks } from '../registered-blocks';

const initialState = {
	isLoaded: false,
	blocks: {},
	blocksPage: 1,
	blocksTotalPages: 1,
	initialBlocks: {},
	savingQueues: {},
	savingTimeouts: {},
};

const BlocksContext = React.createContext( [ initialState, () => {} ] );

const BlocksProvider = ( props ) => {
	const [ state, setState ] = useState( initialState );

	// Get blocks from API.
	useEffect( () => {
		const fetchBlocks = async () => {
			const currentBlocks = state.blocks;

			let currentPage = state.blocksPage;
			let currentTotalPages = state.blocksTotalPages;

			// Loop over pages.
			while ( currentPage <= currentTotalPages ) {
				const res = await getPagedRegisteredBlocks(
					{
						per_page: 100,
						page: currentPage,
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
					setState( ( prevState ) => ( {
						...prevState,
						blocksTotalPages: currentTotalPages,
					} ) );
				}

				// Add blocks to global list.
				( await res.json() ).forEach( ( block ) => {
					currentBlocks[ block.name ] = pick( block, blockFields );
				} );

				// Update page counter.
				currentPage++;
				setState( ( prevState ) => ( {
					...prevState,
					blocksPage: currentPage,
				} ) );
			}

			setState( ( prevState ) => ( {
				...prevState,
				blocks: currentBlocks,
				initialBlocks: cloneDeep( currentBlocks ),
				isLoaded: true,
			} ) );
		};

		fetchBlocks();
	}, [] );

	// Enqueue modifications to delay treatments.
	useEffect( () => {
		if ( ! isEmpty( state.blocks ) ) {
			Object.values( state.blocks ).forEach( ( block ) => {
				const savingQueue = state.savingQueues[ block.name ] ?? [];
				const savingBlock = { ...cloneDeep( block ), isSaving: false };

				const firstBlock =
					savingQueue.length > 0
						? pick( savingQueue[ 0 ], blockFields )
						: undefined;

				if (
					savingQueue.length === 1 &&
					! savingQueue[ 0 ].isSaving &&
					! isEqual( block, state.initialBlocks[ block.name ] )
				) {
					// Replace first modification during waiting time.
					savingQueue[ 0 ] = savingBlock;
				} else if (
					( savingQueue.length === 0 &&
						! isEqual(
							block,
							state.initialBlocks[ block.name ]
						) ) ||
					( savingQueue.length === 1 &&
						! isEqual( block, firstBlock ) )
				) {
					// Enqueue modification.
					savingQueue.push( savingBlock );
				} else if (
					( savingQueue.length === 2 &&
						isEqual( firstBlock, block ) ) ||
					( savingQueue.length === 1 &&
						! savingQueue[ 0 ].isSaving &&
						isEqual( block, state.initialBlocks[ block.name ] ) )
				) {
					// Remove modification if finally there is no modification.
					savingQueue.pop();
				} else if ( savingQueue.length === 2 ) {
					// Replace seconf modification in queue.
					savingQueue[ 1 ] = savingBlock;
				}

				setState( ( prevState ) => ( {
					...prevState,
					savingQueues: {
						...prevState.savingQueues,
						[ block.name ]: savingQueue,
					},
				} ) );
			} );
		}
	}, [ state.blocks ] );

	// Treat modifications with delay.
	useEffect( () => {
		const savingBlockNames = Object.keys( state.savingQueues );

		// Remove empty queues.
		savingBlockNames
			.filter( ( name ) => state.savingQueues[ name ].length === 0 )
			.forEach( ( name ) => {
				setState( ( prevState ) => ( {
					...prevState,
					savingQueues: omit( prevState.savingQueues, [ name ] ),
				} ) );
			} );

		// Delay treatment of enqueued modifications.
		savingBlockNames
			.filter(
				( name ) =>
					state.savingQueues[ name ].length > 0 &&
					! state.savingQueues[ name ][ 0 ].isSaving
			)
			.forEach( delaySendingBlockToAPI );
	}, [ state.savingQueues ] );

	function delayForBlock( name, ms ) {
		const timeoutID = state.savingTimeouts[ name ];

		if ( Number.isInteger( timeoutID ) ) {
			clearTimeout( timeoutID );
		}

		return new Promise( ( resolve ) => {
			const newTimeoutID = setTimeout( () => {
				setState( ( prevState ) => ( {
					...prevState,
					savingTimeouts: omit( prevState.savingTimeouts, [ name ] ),
				} ) );

				resolve();
			}, ms );

			setState( ( prevState ) => ( {
				...prevState,
				savingTimeouts: {
					...prevState.savingTimeouts,
					[ name ]: newTimeoutID,
				},
			} ) );
		} );
	}

	async function delaySendingBlockToAPI( name ) {
		await delayForBlock( name, 2000 );
		sendBlockToAPI( name );
	}

	function sendBlockToAPI( name ) {
		const savingQueue = state.savingQueues[ name ];

		savingQueue[ 0 ].isSaving = true;

		setState( ( prevState ) => ( {
			...prevState,
			savingQueues: { ...prevState.savingQueues, [ name ]: savingQueue },
		} ) );

		// TODO: replace Promise with API fetch.
		new Promise( ( resolve ) => {
			setTimeout( resolve, 5000 );
		} ).then( () => {
			const newBlock = cloneDeep(
				pick( savingQueue.shift(), blockFields )
			);

			if ( savingQueue.length > 0 ) {
				sendBlockToAPI( name );
			}

			setState( ( prevState ) => ( {
				...prevState,
				initialBlocks: {
					...prevState.initialBlocks,
					[ name ]: newBlock,
				},
				savingQueues: {
					...prevState.savingQueues,
					[ name ]: savingQueue,
				},
			} ) );
		} );
	}

	return (
		<BlocksContext.Provider value={ [ state, setState ] }>
			{ props.children }
		</BlocksContext.Provider>
	);
};

export { BlocksContext, BlocksProvider };

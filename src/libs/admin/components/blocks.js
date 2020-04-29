import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getPagedRegisteredBlocks } from '../../registered-blocks';
import BlockList from './block-list';

const {
	i18n: { __ },
} = wp;

const Blocks = () => {
	const [ isLoading, setIsLoading ] = useState( true );

	const [ page, setPage ] = useState( 1 );
	const [ totalPages, setTotalPages ] = useState( 1 );

	const [ initialBlocks, setInitialBlocks ] = useState( {} );
	const [ blocks, setBlocks ] = useState( {} );
	useEffect( () => {
		const fetchBlocks = async () => {
			const currentBlocks = blocks;

			let currentPage = page;
			let currentTotalPages = totalPages;

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
				if ( totalPages === 1 && totalPages !== currentTotalPages ) {
					setTotalPages( currentTotalPages );
				}

				// Add blocks to global list.
				( await res.json() ).forEach( ( block ) => {
					currentBlocks[ block.name ] = block;
				} );

				// Update page counter.
				currentPage++;
				setPage( currentPage );
			}

			setInitialBlocks( currentBlocks );
			setBlocks( currentBlocks );

			setIsLoading( false );
		};

		fetchBlocks();
	}, [] );

	const handleBlockChange = ( block ) => {
		// Object.values( blocks ).forEach( (b) => {
		// 	b.updated = false;
		// });

		// blocks[ block.name ] = { ...block, updated: true };

		// console.log( { ...block, updated: true } );
		// console.log( blocks['core/audio'] );
		// const updatedBlocks = { ...blocks, [ block.name ]: block };
		// console.log( updatedBlocks['core/audio'] );

		// setBlocks( { ...blocks, [ block.name ]: { ...block, updated: Date.now() } } );
		setBlocks( { ...blocks, [ block.name ]: block } );
	};

	const handleOnSave = () => {
		const blocksToUpdate = [];

		Object.keys( initialBlocks ).forEach( ( key ) => {
			if ( ! isEqual( initialBlocks[ key ], blocks[ key ] ) ) {
				blocksToUpdate.push( blocks[ key ] );
			}
		} );

		// TODO: check equality.
		// TODO: send updated blocks to API.
		// TODO: update initialBlocks with current blocks state.
		// console.log( blocksToUpdate );
	};

	if ( isLoading ) {
		return <div>{ __( 'Loading...', 'bmfbe' ) }</div>;
	}

	const valuedBlocks = Object.values( blocks );

	const categories = valuedBlocks.reduce( ( cats, block ) => {
		if ( ! cats.includes( block.category ) ) {
			cats.push( block.category );
		}

		return cats;
	}, [] );

	return (
		<>
			<Accordion
				allowMultipleExpanded={ true }
				allowZeroExpanded={ true }
				preExpanded={ [ categories[ 0 ] ] }
			>
				{ categories.map( ( category ) => (
					<AccordionItem key={ category } uuid={ category }>
						<AccordionItemHeading>
							<AccordionItemButton>
								{ category }
							</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel>
							<BlockList
								blocks={ valuedBlocks.filter(
									( block ) => block.category === category
								) }
								onChange={ handleBlockChange }
							/>
						</AccordionItemPanel>
					</AccordionItem>
				) ) }
			</Accordion>
			<button onClick={ handleOnSave }>Save</button>
		</>
	);
};

export default Blocks;

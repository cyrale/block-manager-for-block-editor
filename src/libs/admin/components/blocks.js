import { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getPagedRegisteredBlocks } from '../../registered-blocks';
import Block from './block';

const {
	i18n: { __ },
} = wp;

const Blocks = () => {
	const [ isLoading, setIsLoading ] = useState( true );

	const [ page, setPage ] = useState( 1 );
	const [ totalPages, setTotalPages ] = useState( 1 );

	const [ blocks, setBlocks ] = useState( [] );
	useEffect( () => {
		const fetchBlocks = async () => {
			let currentBlocks = blocks;

			let currentPage = page;
			let currentTotalPages = totalPages;

			while ( currentPage <= currentTotalPages ) {
				const res = await getPagedRegisteredBlocks(
					{
						page: currentPage,
						_fields: [ 'name', 'category' ],
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
				currentBlocks = [ ...currentBlocks, ...( await res.json() ) ];
				setBlocks( currentBlocks );

				// Update page counter.
				currentPage++;
				setPage( currentPage );
			}

			setIsLoading( currentPage <= currentTotalPages );
		};

		fetchBlocks();
	}, [] );

	if ( isLoading ) {
		return <div>{ __( 'Loading...', 'bmfbe' ) }</div>;
	}

	const categories = blocks.reduce( ( cats, block ) => {
		if ( ! cats.includes( block.category ) ) {
			cats.push( block.category );
		}

		return cats;
	}, [] );

	return (
		<Accordion
			allowMultipleExpanded={ true }
			allowZeroExpanded={ true }
			preExpanded={ [ categories[ 0 ] ] }
		>
			{ categories.map( ( category ) => (
				<AccordionItem key={ category } uuid={ category }>
					<AccordionItemHeading>
						<AccordionItemButton>{ category }</AccordionItemButton>
					</AccordionItemHeading>
					<AccordionItemPanel>
						{ blocks
							.filter( ( block ) => block.category === category )
							.map( ( block ) => (
								<Block key={ block.name } { ...block } />
							) ) }
					</AccordionItemPanel>
				</AccordionItem>
			) ) }
		</Accordion>
	);
};

export default Blocks;

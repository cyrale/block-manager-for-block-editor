export function getCategories( state ) {
	return state.categories;
}

export function getCategorizedBlocks( state ) {
	const categorizedBlocks = {};

	state.categories.forEach( ( category ) => {
		categorizedBlocks[ category ] = state.list.filter(
			( block ) => block.category === category
		);
	} );

	return categorizedBlocks;
}

export function getBlocks( state ) {
	return state.list;
}

export function getBlock( state, name ) {
	return state.blocks[ name ].value;
}

export function getStatus( state, name = '' ) {
	if ( '' === name ) {
		return state.status;
	}

	return state.blocks[ name ].status;
}

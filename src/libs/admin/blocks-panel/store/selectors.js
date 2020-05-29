export function getCategories( state ) {
	return state.categories;
}

export function getBlocks( state ) {
	return state.list;
}

export function getBlock( state, name ) {
	return state.blocks[ name ].value;
}

export function loadingStatus( state ) {
	return state.loadingStatus;
}

export function savingStatus( state, name = '' ) {
	if ( '' === name ) {
		return Object.values( state.blocks ).reduce(
			( saving, block ) => saving || block.savingStatus,
			false
		);
	}

	return state.blocks[ name ].savingStatus;
}

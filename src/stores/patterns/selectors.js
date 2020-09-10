export function getPatternCategories( state ) {
	return state.categories;
}

export function getPatterns( state ) {
	return state.list;
}

export function getPattern( state, name ) {
	return state.patterns[ name ].value;
}

export function getStatus( state, name = '' ) {
	if ( '' === name ) {
		return state.status;
	}

	return state.patterns[ name ].status;
}

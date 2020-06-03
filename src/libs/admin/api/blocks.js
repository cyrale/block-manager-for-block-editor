const { omit } = lodash;
const {
	apiFetch,
	url: { addQueryArgs, isValidPath },
} = wp;

export const BLOCKS_API_PATH = '/bmfbe/v1/blocks';

export async function allBlocks() {
	const apiBlocks = await apiFetch( {
		path: addQueryArgs( BLOCKS_API_PATH, { per_page: -1 } ),
		method: 'GET',
	} );

	return apiBlocks.map( ( block ) => omit( block, [ '_links' ] ) );
}

export async function oneBlock( name ) {
	if ( ! isValidPath( name ) ) {
		return false;
	}

	const block = await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ name }`,
		method: 'GET',
	} );

	return omit( block, [ '_links' ] );
}

export async function createBlock( block ) {
	const res = await apiFetch( {
		path: BLOCKS_API_PATH,
		method: 'POST',
		data: block,
	} );

	return omit( res, [ '_links' ] );
}

export async function updateBlock( block ) {
	const res = await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ block.name }`,
		method: 'PUT',
		data: block,
	} );

	return omit( res, [ '_links' ] );
}

export async function deleteBlock( name ) {
	return await apiFetch( {
		path: `${ BLOCKS_API_PATH }/${ name }`,
		method: 'DELETE',
	} );
}

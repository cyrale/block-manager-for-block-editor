export * from '../common/collection/actions';

export function createItems( items ) {
	return {
		type: 'CREATE_ITEMS',
		items,
	};
}

export function updateItems( items ) {
	return {
		type: 'UPDATE_ITEMS',
		items,
	};
}

export function deleteItems( items ) {
	return {
		type: 'DELETE_ITEMS',
		items,
	};
}

export * from '../common/collection/actions';

export function createItems( items ) {
	return {
		items,
		type: 'CREATE_ITEMS',
	};
}

export function updateItems( items ) {
	return {
		items,
		type: 'UPDATE_ITEMS',
	};
}

export function deleteItems( items ) {
	return {
		items,
		type: 'DELETE_ITEMS',
	};
}

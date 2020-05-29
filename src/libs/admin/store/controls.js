const { apiFetch: wpApiFetch } = wp;

/**
 * Trigger an API Fetch request.
 *
 * @param {Object} request API Fetch Request Object.
 * @return {Object} control descriptor.
 */
export function apiFetch( request ) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function API_FETCH( { request } ) {
	return wpApiFetch( request );
}

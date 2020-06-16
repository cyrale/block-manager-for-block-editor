import shortid from 'shortid';

const {
	element: { useEffect, useState },
	url: { cleanForSlug },
} = wp;

/**
 * Generate random short ID.
 *
 * @param {string} prefix Prefix to use with short ID.
 *
 * @return {string} Short ID.
 * @since 1.0.0
 */
function useShortID( prefix ) {
	const [ shortID, setShortID ] = useState( '' );

	useEffect( () => {
		if ( ! shortID ) {
			setShortID( shortid.generate() );
		}
	}, [] );

	return cleanForSlug( prefix ) + '-' + shortID;
}

export default useShortID;

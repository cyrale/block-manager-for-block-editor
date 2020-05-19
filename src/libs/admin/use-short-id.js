import shortid from 'shortid';

const {
	element: { useEffect, useState },
	url: { cleanForSlug },
} = wp;

const useShortID = ( prefix ) => {
	const [ shortID, setShortID ] = useState( '' );

	useEffect( () => {
		if ( ! shortID ) {
			setShortID( shortid.generate() );
		}
	}, [] );

	return cleanForSlug( prefix ) + '-' + shortID;
};

export default useShortID;

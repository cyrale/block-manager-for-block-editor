import { useEffect, useState } from 'react';
import shortid from 'shortid';

const {
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

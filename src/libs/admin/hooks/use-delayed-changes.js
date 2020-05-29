const { cloneDeep, isEqual, merge } = lodash;
const {
	element: { useRef },
} = wp;

function useDelayedChanges( changesCallback ) {
	const queue = useRef( [] );
	const initialData = useRef( {} );
	const isStarted = useRef( false );
	const timeoutID = useRef( null );

	function setInitialData( data ) {
		initialData.current = cloneDeep( data );
	}

	function enqueueChanges( data ) {
		const savingData = cloneDeep( data );
		const firstData = queue.current.length > 0 ? queue.current[ 0 ] : null;

		if (
			1 === queue.current.length &&
			! isStarted.current &&
			! isEqual( savingData, initialData.current )
		) {
			// Replace first modification during waiting time.
			queue.current = [ savingData ];
		} else if (
			( 1 === queue.current.length &&
				! isStarted.current &&
				isEqual( savingData, initialData.current ) ) ||
			( 2 === queue.current.length && isEqual( savingData, firstData ) )
		) {
			// Remove modification if finally there is no modification.
			queue.current = queue.current.slice( 0, 1 );
		} else if (
			( 0 === queue.current.length &&
				! isEqual( savingData, initialData.current ) ) ||
			( 1 === queue.current.length && ! isEqual( savingData, firstData ) )
		) {
			// Enqueue modification.
			queue.current = [ ...queue.current, ...[ savingData ] ];
		} else if ( 2 === queue.current.length ) {
			// Replace second modification in queue.
			queue.current = [
				...queue.current.slice( 0, 1 ),
				...[ savingData ],
			];
		}

		maybeLaunchCallbackWithDelay();

		return queue.current.length;
	}

	// Treat modifications with delay.
	function maybeLaunchCallbackWithDelay() {
		if ( 0 === queue.current.length ) {
			// Reset delayed treatment.
			clearTimeout( timeoutID.current );
			isStarted.current = false;
		} else if ( queue.current.length > 0 && ! isStarted.current ) {
			// Delay treatment of enqueued modifications.
			delayChangesCallback();
		} else if ( queue.current.length > 0 && isStarted.current ) {
			// Immediately.
			runChangesCallback();
		}
	}

	async function delayChangesCallback() {
		// Reset timeout.
		if ( Number.isInteger( timeoutID.current ) ) {
			clearTimeout( timeoutID.current );
		}

		await new Promise( ( resolve ) => {
			timeoutID.current = setTimeout( () => {
				isStarted.current = true;
				resolve();
			}, 2000 );
		} );

		runChangesCallback();
	}

	async function runChangesCallback() {
		await changesCallback( queue.current[ 0 ] );

		queue.current = queue.current.slice( 1 );

		maybeLaunchCallbackWithDelay();
	}

	return {
		enqueueChanges,
		setInitialData,
	};
}

export default useDelayedChanges;

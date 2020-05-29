const { cloneDeep, isEqual } = lodash;
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
			queue.current.length === 1 &&
			! isStarted.current &&
			! isEqual( savingData, initialData.current )
		) {
			// Replace first modification during waiting time.
			queue.current = [ savingData ];
		} else if (
			( queue.current.length === 2 &&
				isEqual( savingData, firstData ) ) ||
			( queue.current.length === 1 &&
				! isStarted.current &&
				isEqual( savingData, initialData.current ) )
		) {
			// Remove modification if finally there is no modification.
			queue.current = queue.current.slice( 0, 1 );
		} else if (
			( queue.current.length === 0 &&
				! isEqual( savingData, initialData.current ) ) ||
			( queue.current.length === 1 && ! isEqual( savingData, firstData ) )
		) {
			// Enqueue modification.
			queue.current = [ ...queue.current, ...[ savingData ] ];
		} else if ( queue.current.length === 2 ) {
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
		if ( queue.current.length === 0 ) {
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

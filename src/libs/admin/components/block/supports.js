import Support from '../support';

const Supports = ( props ) => (
	<div className="bmfbe-block__supports">
		{ Object.entries( props ).map( ( [ name, args ] ) => (
			<Support key={ name } { ...Object.assign( args, { name } ) } />
		) ) }
	</div>
);

export default Supports;

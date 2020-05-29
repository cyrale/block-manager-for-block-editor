import { BLOCKS_PANEL_STORE, STATUS_SAVING } from './store/constants';

const {
	data: { useSelect },
} = wp;

export default function Description( { description, name, title } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_PANEL_STORE ).getStatus( name ),
		[]
	);

	return (
		<div className="bmfbe-block__description">
			<h3>
				{ title } { STATUS_SAVING === status && 'Saving...' }
			</h3>
			<p>
				<i>{ name }</i>
			</p>
			<p>{ description }</p>
		</div>
	);
}

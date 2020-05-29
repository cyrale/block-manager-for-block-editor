import { BLOCKS_PANEL_STORE, STATUS_PENDING } from './store/constants';

const {
	data: { useSelect },
} = wp;

export default function Description( { description, name, title } ) {
	const savingStatus = useSelect(
		( select ) => select( BLOCKS_PANEL_STORE ).savingStatus( name ),
		[]
	);

	return (
		<div className="bmfbe-block__description">
			<h3>
				{ title } { savingStatus === STATUS_PENDING && 'Saving...' }
			</h3>
			<p>
				<i>{ name }</i>
			</p>
			<p>{ description }</p>
		</div>
	);
}

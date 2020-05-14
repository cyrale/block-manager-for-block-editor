export default function Description( {
	description,
	name,
	saveInProgress,
	title,
} ) {
	return (
		<div className="bmfbe-block__description">
			<h3>
				{ title } { saveInProgress ? 'Saving...' : '' }
			</h3>
			<p>
				<i>{ name }</i>
			</p>
			<p>{ description }</p>
		</div>
	);
}

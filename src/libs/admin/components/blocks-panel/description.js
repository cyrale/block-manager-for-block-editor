export default function Description( { description, name, title } ) {
	return (
		<div className="bmfbe-block__description">
			<h4 className="bmfbe-block__title">{ title }</h4>
			<p className="bmfbe-block__name">{ name }</p>
			<p>{ description }</p>
		</div>
	);
}

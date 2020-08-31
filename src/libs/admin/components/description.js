export default function Description( {
	classPrefix,
	description,
	name,
	title,
} ) {
	return (
		<div className={ `bmfbe-${ classPrefix }__description` }>
			<h4 className={ `bmfbe-${ classPrefix }__title` }>{ title }</h4>
			<p className={ `bmfbe-${ classPrefix }__name` }>{ name }</p>
			<p>{ description }</p>
		</div>
	);
}

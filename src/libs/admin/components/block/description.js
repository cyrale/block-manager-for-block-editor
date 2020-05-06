const Description = ( props ) => (
	<div className="bmfbe-block__description">
		<h3>
			{ props.title } { props.savingStatus ? 'Saving...' : '' }
		</h3>
		<p>
			<i>{ props.name }</i>
		</p>
		<p>{ props.description }</p>
	</div>
);

export default Description;

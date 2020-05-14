export default function Icon( { icon } ) {
	if ( 'string' === typeof icon && '' !== icon ) {
		if ( /^<svg (.*)<\/svg>$/i.test( icon ) ) {
			return (
				<div
					className="bmfbe-block__icon"
					dangerouslySetInnerHTML={ { __html: icon } }
				/>
			);
		}

		return (
			<div className="bmfbe-block__icon">
				<span className={ `dashicons dashicons-${ icon }` } />
			</div>
		);
	}

	return <div className="bmfbe-block__icon" />;
}

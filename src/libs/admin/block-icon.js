const BlockIcon = ( props ) => {
	if ( 'string' === typeof props.icon && '' !== props.icon ) {
		if ( /^<svg (.*)<\/svg>$/i.test( props.icon ) ) {
			return (
				<div
					className="bmfbe-block__icon"
					dangerouslySetInnerHTML={ { __html: props.icon } }
				/>
			);
		}

		return (
			<div className="bmfbe-block__icon">
				<span className={ `dashicons dashicons-${ props.icon }` } />
			</div>
		);
	}

	return <></>;
};

export default BlockIcon;

function Head( { children } ) {
	if ( children.length < 2 ) {
		return <></>;
	}

	return (
		<thead>
			<tr>
				<td></td>
				{ children }
			</tr>
		</thead>
	);
}

export default Head;

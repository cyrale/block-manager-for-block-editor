const { pick } = lodash;
const { blocks } = wp;

export default () => {
	// console.log( 'detection' );

	// console.log(blocks.getBlockTypes());

	blocks
		.getBlockTypes()
		.filter(
			( block ) =>
				block.supports === undefined ||
				block.supports.inserter !== false
		)
		.map( ( block ) =>
			pick( block, [
				'name',
				'title',
				'description',
				'category',
				'icon',
				'keywords',
				'supports',
				'styles',
			] )
		);
	// console.log( b );

	// window.location.href = 'https://www.google.fr';
};

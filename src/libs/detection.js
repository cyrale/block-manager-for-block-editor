const { pick } = lodash;
const { blocks } = wp;

export default () => {
	// console.log( 'detection' );

	blocks
		.getBlockTypes()
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

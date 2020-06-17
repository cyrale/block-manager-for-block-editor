import Styles from './styles';

export default function Variations( { onChange, value } ) {
	return (
		<Styles
			className="bmfbe-block__variations"
			value={ value }
			onChange={ onChange }
		/>
	);
}

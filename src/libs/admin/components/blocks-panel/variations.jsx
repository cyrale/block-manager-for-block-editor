import Styles from './styles';

export default function Variations( { className, onChange, value } ) {
	if ( ! className ) {
		className = 'bmfbe-block__variations';
	}

	return (
		<Styles className={ className } value={ value } onChange={ onChange } />
	);
}

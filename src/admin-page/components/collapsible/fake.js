/**
 * External dependencies
 */
import classnames from 'classnames';

export default function Fake( { className, trigger } ) {
	return (
		<div
			className={ classnames(
				'collapsible__wrapper',
				'collapsible__wrapper--fake',
				className
			) }
		>
			<div className={ classnames( 'collapsible__item', className ) }>
				<span
					className={ classnames(
						'collapsible__item__trigger',
						className
					) }
				>
					{ trigger }
				</span>
			</div>
		</div>
	);
}

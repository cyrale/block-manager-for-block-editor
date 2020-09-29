/**
 * Internal dependencies
 */
import { STATUS_LOADING } from '../constants';

export { STATUS_LOADING, STATUS_PENDING, STATUS_SAVING } from '../constants';

export const DEFAULT_STATE = {
	initialValue: {},
	status: STATUS_LOADING,
	value: {},
};

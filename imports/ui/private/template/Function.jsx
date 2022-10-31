import { useNavigate } from 'react-router-dom';
export function navigateTo(routeName) {
	let navigate = useNavigate();

	navigate(routeName);
}

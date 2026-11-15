import { useParams } from 'react-router';

const ActorPage = () => {
	const { id } = useParams();
	return <div>Actor: {id}</div>;
};
export default ActorPage;

import Trending from '../components/Trending';
import LatestTrailers from '../components/LatestTrailers';
import Hero from '../components/Hero';

const HomePage = () => {
	return (
		<div className='home-page'>
			<Hero />
			<Trending />
			<LatestTrailers />
		</div>
	);
};
export default HomePage;

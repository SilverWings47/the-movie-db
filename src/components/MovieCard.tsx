import { getYear } from 'date-fns';
import { FiCameraOff } from 'react-icons/fi';
import type { Movie } from '../App';

type MovieCardProps = {
	movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps) => {
	return (
		<div className='movie-card'>
			{movie.poster === null ? (
				<div className='no-image'>
					<FiCameraOff className='camera' />
					<span>No Image</span>
				</div>
			) : (
				<img
					src={'https://image.tmdb.org/t/p/original' + movie.poster}
					alt={movie.title}
				/>
			)}
			<p className='movie-title'>{movie.title}</p>
			<p className='movie-year'>{getYear(movie.year)}</p>
		</div>
	);
};
export default MovieCard;

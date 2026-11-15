import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { authKey } from '../utils/authKey';
import { formatDate } from '../utils/formatting';
import { type TmdbResponseType } from '../utils/types';

type TrendingMovie = {
	id: string;
	title: string;
	release_date: string;
	poster: string | null;
};

type TrendingMovieTmdbType = {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	media_type: 'movie';
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

const Trending = () => {
	const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [trendingTimeWindow, setTrendingTimeWindow] = useState<'day' | 'week'>(
		'day',
	);

	useEffect(() => {
		async function fetchTrendingMovies(): Promise<void> {
			try {
				setIsLoading(true);
				const options = {
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: authKey,
					},
				};
				const response = await fetch(
					`https://api.themoviedb.org/3/trending/movie/${trendingTimeWindow}`,
					options,
				);
				const data: TmdbResponseType<TrendingMovieTmdbType> =
					await response.json();
				const newMovieArray: TrendingMovie[] = data.results.map((movie) => {
					return {
						id: String(movie.id),
						title: movie.title,
						release_date: formatDate(movie.release_date),
						poster: movie.poster_path,
					};
				});
				setTrendingMovies(newMovieArray);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchTrendingMovies();
	}, [trendingTimeWindow]);

	return (
		<section className='trending-movies'>
			<div className='wrapper'>
				<h3>Trending</h3>
				<div className='timing-options'>
					<span
						onClick={() => {
							setTrendingTimeWindow('day');
						}}>
						Today
					</span>
					<span
						onClick={() => {
							setTrendingTimeWindow('week');
						}}>
						This Week
					</span>
					<span
						className='empty-span'
						style={{
							transform:
								trendingTimeWindow === 'day'
									? 'translateX(0%)'
									: 'translateX(100%)',
						}}></span>
				</div>
			</div>

			{isLoading ? (
				<span>Loading</span>
			) : (
				<div className='carousel-container'>
					{trendingMovies.map((movie) => (
						<Link
							key={movie.id}
							to={`/movie/${movie.id}`}>
							<div className='carousel-item'>
								<img
									src={'https://image.tmdb.org/t/p/w300' + movie.poster}
									alt={movie.title}
								/>
								<p className='title'>{movie.title}</p>
								<p className='release-date'>{movie.release_date}</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</section>
	);
};
export default Trending;

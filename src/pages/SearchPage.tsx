import { Link, useSearchParams } from 'react-router';
import { useEffect } from 'react';
import type { Movie } from '../App';
import MovieCard from '../components/MovieCard';
import { FadeLoader } from 'react-spinners';
import { authKey } from '../utils/authKey';
import type { TmdbResponseType, TMDbTypeByTitle } from '../utils/types';

type MovieGridProps = {
	movies: Movie[];
	isLoading: boolean;
	setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchPage = ({
	movies,
	isLoading,
	setMovies,
	setIsLoading,
}: MovieGridProps) => {
	// const sortedMovies = movies.sort((a, b) => getYear(b.year) - getYear(a.year));
	const [searchParams] = useSearchParams();

	useEffect(() => {
		async function fetchMoviesByTitle(movieTitle: string | null) {
			try {
				if (!movieTitle) throw new Error('No title given');
				setIsLoading(true);
				setMovies([]);
				const options = {
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: authKey,
					},
				};
				const response = await fetch(
					`https://api.themoviedb.org/3/search/movie?query=${movieTitle}`,
					options,
				);
				const data =
					(await response.json()) as TmdbResponseType<TMDbTypeByTitle>;
				console.log(data);

				const newMovieArray: Movie[] = data.results.map((movie) => {
					const {
						poster_path: poster,
						title,
						release_date: year,
						id,
						overview,
					} = movie;
					return {
						id,
						title,
						year,
						poster,
						overview,
					};
				});

				setMovies(newMovieArray);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchMoviesByTitle(searchParams.get('query'));
	}, [searchParams.get('query')]);

	return (
		<div className='movie-grid'>
			{isLoading ? (
				<div className='movie-grid__nothing'>
					<FadeLoader color='#929292' />
					<p style={{ color: 'white' }}>Loading</p>
				</div>
			) : (
				movies.map((movie) => {
					return (
						<Link
							key={movie.id}
							to={`/movie/${movie.id}`}>
							<MovieCard movie={movie} />
						</Link>
					);
				})
			)}
		</div>
	);
};
export default SearchPage;

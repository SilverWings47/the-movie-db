import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { authKey } from '../utils/authKey';
import { FiCameraOff } from 'react-icons/fi';
import { FadeLoader } from 'react-spinners';
import { getYear } from 'date-fns';
import Cast from '../components/Cast';

interface TmdbTypeById {
	adult: boolean;
	backdrop_path: string | null;
	belongs_to_collection: {
		id: number;
		name: string;
		poster_path: string | null;
		backdrop_path: string | null;
	} | null;
	budget: number;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string | null;
	id: number;
	imdb_id: string | null; // e.g. "tt0137523"
	origin_country: string[];
	original_language: string; // e.g. "en"
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null; // e.g. "/abc123.jpg" — prepend image base URL
	production_companies: {
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	release_date: string; // "YYYY-MM-DD"
	revenue: number;
	runtime: number | null; // in minutes
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status:
		| 'Rumored'
		| 'Planned'
		| 'In Production'
		| 'Post Production'
		| 'Released'
		| 'Canceled';
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number; // 0–10
	vote_count: number;
}

type MovieInfo = {
	id: string;
	title: string;
	year: string;
	poster: string | null;
	runtime: number | null;
	rating: string;
	genres: {
		id: number;
		name: string;
	}[];
	overview: string | null;
	country: string[];
	backdrop_path: string | null;
};

type MoviePageProps = {
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MoviePage = ({ isLoading, setIsLoading }: MoviePageProps) => {
	const { id: movie_id } = useParams();
	const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null);

	useEffect(() => {
		async function fetchMovie() {
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
					`https://api.themoviedb.org/3/movie/${movie_id}`,
					options,
				);
				const data: TmdbTypeById = await response.json();
				const {
					id,
					title,
					release_date,
					poster_path,
					runtime,
					vote_average,
					genres,
					overview,
					origin_country,
					backdrop_path,
				} = data;
				console.log(data);

				setMovieInfo({
					id: String(id),
					title,
					year: release_date,
					poster: poster_path,
					runtime,
					rating: String(vote_average),
					genres,
					overview,
					country: origin_country,
					backdrop_path,
				});
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchMovie();
	}, []);

	return (
		<>
			{isLoading && (
				<div className='movie-grid__nothing'>
					<FadeLoader color='#929292' />
					<p style={{ color: 'white' }}>Loading</p>
				</div>
			)}
			{movieInfo && (
				<>
					<section>
						<div
							className='movie-page'
							style={{
								backgroundImage: `url(https://image.tmdb.org/t/p/original${movieInfo.backdrop_path})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center 20%',
								backgroundRepeat: 'no-repeat',
								backgroundColor: 'rgba(0,0,0,0.5)',
								backgroundBlendMode: 'multiply',
							}}>
							<div className='movie-poster'>
								<span className='movie-rating'>
									{parseFloat(movieInfo.rating) === 0
										? 'N/A'
										: parseFloat(movieInfo.rating).toFixed(1) + '/10'}
								</span>
								{movieInfo.poster ? (
									<img
										src={
											'https://image.tmdb.org/t/p/original' + movieInfo.poster
										}
										alt={movieInfo.title}
									/>
								) : (
									<div className='no-image'>
										<FiCameraOff className='camera' />
										<span>No Image</span>
									</div>
								)}
							</div>
							<div className='movie-info'>
								<h1 className='movie-title'>
									{movieInfo.title}{' '}
									<span className='movie-year'>
										({getYear(movieInfo.year)})
									</span>
								</h1>
								<div className='secondary-info'>
									<p>
										<label>Released:</label>
										<span className='movie-released'>{movieInfo.year}</span>
									</p>
									<p>
										<label>Genres:</label>
										{movieInfo.genres.map((genre, index) => (
											<span
												key={genre.id}
												className='movie-genre'>
												{genre.name}
												{index + 1 < movieInfo.genres.length ? ', ' : ''}
											</span>
										))}
									</p>
									<p>
										<label>Runtime:</label>
										<span className='movie-runtime'>
											{`${(movieInfo.runtime! / 60).toFixed(0)}h ${movieInfo.runtime! % 60}m`}
										</span>
									</p>
									{/* <p>
    <label>Actors:</label>
    <span className='movie-actors'>{movieInfo?.actors}</span>
</p> */}
									<p>
										<label>Country:</label>
										{movieInfo.country.map((c, index) => (
											<span
												key={c}
												className='movie-country'>
												{c +
													`${index + 1 < movieInfo.country.length ? ', ' : ''}`}
											</span>
										))}
									</p>
								</div>
								<div className='plot'>
									<h2>Overview:</h2>
									<p className='movie-plot'>{movieInfo.overview}</p>
								</div>
							</div>
						</div>
					</section>
					<Cast movieId={movieInfo.id} />
				</>
			)}
		</>
	);
};
export default MoviePage;

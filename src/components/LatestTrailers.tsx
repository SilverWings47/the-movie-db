import { useEffect, useState } from 'react';
import { authKey } from '../utils/authKey';
import { type TmdbResponseType } from '../utils/types';
import { FaPlay } from 'react-icons/fa6';
import { Link } from 'react-router';

type TrailerTabs =
	| 'Popular'
	| 'Streaming'
	| 'On Tv'
	| 'For Rent'
	| 'In Theaters';

type TrailerType = 'popular' | 'now_playing' | 'rent' | 'streaming' | 'tv';

type TrendingMovieTmdbType = {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	media_type: 'movie';
	original_language: string;
	original_title: string;
	name: string | undefined;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

type FetchedTrailerType = {
	id: string;
	results: {
		iso_639_1: string;
		iso_3166_1: string;
		name: string;
		key: string;
		site: string;
		size: number;
		type: string;
		official: boolean;
		id: string;
		published_at: string;
	}[];
};

type Trailer = {
	id: string;
	url: string;
	title: string;
	thumbnail: string;
};

const LatestTrailers = () => {
	const [trailerRequestUrl, setTrailerRequestUrl] = useState<string>(
		'https://api.themoviedb.org/3/movie/popular?page=1',
	);
	const [trailerTab, setTrailerTab] = useState<TrailerTabs>('Popular');
	const [trailers, setTrailers] = useState<Trailer[]>([]);
	useEffect(() => {
		async function fetchTrailers(): Promise<void> {
			try {
				const options = {
					method: 'GET',
					headers: { accept: 'application/json', Authorization: authKey },
				};
				const response = await fetch(trailerRequestUrl, options);

				const movies: TmdbResponseType<TrendingMovieTmdbType> =
					await response.json();

				const contentType = trailerTab === 'On Tv' ? 'tv' : 'movie';
				const fetchedTrailers = await Promise.all(
					movies.results.map(async (movie) => {
						const response = await fetch(
							`https://api.themoviedb.org/3/${contentType}/${movie.id}/videos`,
							options,
						);
						const videos: FetchedTrailerType = await response.json();

						const newTrailer = videos.results.find(
							(video) => video.type === 'Trailer',
						);

						if (!newTrailer) return null;

						return {
							id: String(movie.id),
							url: newTrailer.key,
							title: movie.title ?? movie.name,
							thumbnail: movie.backdrop_path as string,
						};
					}),
				);

				setTrailers(fetchedTrailers.filter((t) => t !== null));
			} catch (error) {
				console.log(error);
			}
		}

		fetchTrailers();
	}, [trailerRequestUrl]);

	function setSelectorPosition(trailerTab: TrailerTabs): string {
		switch (trailerTab) {
			case 'Popular':
				return '0%';
			case 'Streaming':
				return '100%';
			case 'On Tv':
				return '200%';
			case 'For Rent':
				return '300%';
			case 'In Theaters':
				return '400%';
			default:
				return '0%';
		}
	}

	function setTrailerRequest(trailerType: TrailerType): void {
		switch (trailerType) {
			case 'popular':
				setTrailerTab('Popular');
				setTrailerRequestUrl(
					'https://api.themoviedb.org/3/movie/popular?page=1',
				);
				break;
			case 'now_playing':
				setTrailerTab('In Theaters');
				setTrailerRequestUrl(
					'https://api.themoviedb.org/3/movie/now_playing?page=1',
				);
				break;
			case 'rent':
				setTrailerTab('For Rent');
				setTrailerRequestUrl(
					'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_watch_monetization_types=rent',
				);
				break;
			case 'streaming':
				setTrailerTab('Streaming');
				setTrailerRequestUrl(
					'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_watch_monetization_types=flatrate',
				);
				break;
			case 'tv':
				setTrailerTab('On Tv');
				setTrailerRequestUrl(
					'https://api.themoviedb.org/3/tv/on_the_air?api_key=YOUR_KEY&language=en-US&page=1',
				);
				break;
			default:
				throw new Error('Trailer type not supported');
		}
	}

	return (
		<section className='latest-trailers'>
			<div className='wrapper'>
				<div className='header'>
					<h3>Latest Trailers</h3>
					<div className='trailer-options'>
						<span
							onClick={() => {
								setTrailerRequest('popular');
							}}>
							Popular
						</span>
						<span
							onClick={() => {
								setTrailerRequest('streaming');
							}}>
							Streaming
						</span>
						<span
							onClick={() => {
								setTrailerRequest('tv');
							}}>
							On TV
						</span>
						<span
							onClick={() => {
								setTrailerRequest('rent');
							}}>
							For Rent
						</span>
						<span
							onClick={() => {
								setTrailerRequest('now_playing');
							}}>
							In Theaters
						</span>
						<span
							className='empty-span'
							style={{
								transform: `translateX(${setSelectorPosition(trailerTab)})`,
							}}></span>
					</div>
				</div>
				<div className='trailers-container'>
					{trailers.map((trailer) => (
						<div
							key={trailer.id}
							className='trailer'>
							<a
								href={`https://www.youtube.com/watch?v=${trailer.url}`}
								target='_blank'>
								<div className='thumbnail'>
									<span className='play-btn'>
										<FaPlay />
									</span>
									<img
										src={'https://image.tmdb.org/t/p/w300/' + trailer.thumbnail}
										alt={trailer.title}
									/>
								</div>
							</a>
							<Link to={`/movie/${trailer.id}`}>
								<div className='title'>{trailer.title}</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
export default LatestTrailers;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { authKey } from '../utils/authKey';
import { IoIosArrowForward } from 'react-icons/io';
import { FadeLoader } from 'react-spinners';
import { Link } from 'react-router';

interface PersonDetailsResponseType {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: string | null;
	deathday: string | null;
	gender: 0 | 1 | 2 | 3;
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	known_for_department: string;
	name: string;
	place_of_birth: string | null;
	popularity: number;
	profile_path: string | null;
}

type ActorInfo = {
	actorName: string;
	known_for_department: string;
	gender: number;
	birthday: string | null;
	place_of_birth: string | null;
	also_known_as: string[];
	profile_path: string | null;
	biography: string;
};

export interface PersonMovieCredits {
	id: number;
	cast: MovieCastCredit[];
	crew: MovieCrewCredit[];
}

interface MovieCreditBase {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string; // "YYYY-MM-DD", may be an empty string
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	credit_id: string;
}

export interface MovieCastCredit extends MovieCreditBase {
	character: string;
	order: number;
}

export interface MovieCrewCredit extends MovieCreditBase {
	department: string;
	job: string;
}

const ActorPage = () => {
	const { id: actor_id } = useParams();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [actorInfo, setActorInfo] = useState<ActorInfo | null>(null);
	const [actorBestMovies, setActorBestMovies] = useState<MovieCastCredit[]>([]);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		async function fetchActor() {
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
					`https://api.themoviedb.org/3/person/${actor_id}`,
					options,
				);
				const data: PersonDetailsResponseType = await response.json();
				const {
					name: actorName,
					known_for_department,
					gender,
					birthday,
					place_of_birth,
					also_known_as,
					profile_path,
					biography,
				} = data;
				setActorInfo({
					actorName,
					known_for_department,
					gender,
					birthday,
					place_of_birth,
					also_known_as,
					profile_path,
					biography,
				});
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}

		async function fetchActorMovies() {
			try {
				const options = {
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: authKey,
					},
				};
				const response = await fetch(
					`https://api.themoviedb.org/3/person/${actor_id}/movie_credits`,
					options,
				);
				const data: PersonMovieCredits = await response.json();
				const sortedByPopularity = data.cast.toSorted(
					(a, b) => b.popularity - a.popularity,
				);
				console.log(sortedByPopularity);
				setActorBestMovies(sortedByPopularity.slice(0, 10));
			} catch (error) {
				console.log(error);
			}
		}

		fetchActor();
		fetchActorMovies();
	}, []);

	return isLoading ? (
		<div className='movie-grid__nothing'>
			<FadeLoader color='#929292' />
			<p style={{ color: 'white' }}>Loading</p>
		</div>
	) : (
		<section className='actor-page'>
			<div className='personal-info'>
				<img
					src={'https://image.tmdb.org/t/p/w342' + actorInfo?.profile_path}
					alt={actorInfo?.actorName}
				/>
				<div>
					<h3>Personal Info</h3>
					<p>Known For</p>
					<span>{actorInfo?.known_for_department}</span>
					<p>Known Credits</p>
					<span>N/A</span>
					<p>Gender</p>
					<span>{actorInfo?.gender === 1 ? 'Female' : 'Male'}</span>
					<p>Birthday</p>
					<span>{actorInfo?.birthday}</span>
					<p>Place of Birth</p>
					<span>{actorInfo?.place_of_birth}</span>
					<p>Also Known as</p>
					<span>{actorInfo?.also_known_as[0]}</span>
				</div>
			</div>
			<div className='main-actor-details'>
				<h1>{actorInfo?.actorName}</h1>
				<article className='biography'>
					<h3>Biography</h3>
					<p
						style={
							!isExpanded
								? {
										maxHeight: '200px',
										overflow: 'hidden',
									}
								: {}
						}>
						{actorInfo?.biography}
						<a
							onClick={() => {
								setIsExpanded((prevState) => !prevState);
							}}
							style={{ display: isExpanded ? 'none' : 'inline-flex' }}
							href='#'
							className='read-more-btn'>
							Read More
							<IoIosArrowForward color='#48e484' />
						</a>
					</p>
				</article>
				<div className='known-for'>
					<h3>Known For</h3>
					<div
						className='carousel-container'
						style={{
							marginInline: '0px',
							padding: '0px',
							marginBottom: '1rem',
						}}>
						{actorBestMovies.map((movie) => (
							<Link
								key={movie.id}
								to={`/movie/${movie.id}`}>
								<div
									className='carousel-item'
									style={{ transform: 'none' }}>
									<img
										src={'https://image.tmdb.org/t/p/w300' + movie.poster_path}
										alt={movie.title}
									/>
									<p
										className='title'
										style={{ fontWeight: 'normal', fontSize: '14px' }}>
										{movie.title}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
export default ActorPage;

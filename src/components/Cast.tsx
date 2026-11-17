import { useEffect, useState } from 'react';
import { authKey } from '../utils/authKey';
import { FiCameraOff } from 'react-icons/fi';
import { Link } from 'react-router';

type CastProps = {
	movieId: string;
};

type Actor = {
	id: string;
	name: string;
	character: string;
	profilePicture: string | null;
};

interface CreditsResponse {
	id: number;
	cast: CastMember[];
	crew: CrewMember[];
}

interface CastMember {
	adult: boolean;
	gender: number | null; // 0 = not specified, 1 = female, 2 = male, 3 = non-binary
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	cast_id: number;
	character: string;
	credit_id: string;
	order: number;
}

interface CrewMember {
	adult: boolean;
	gender: number | null;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	department: string;
	job: string;
}

const Cast = ({ movieId }: CastProps) => {
	const [castList, setCastList] = useState<Actor[]>([]);

	useEffect(() => {
		async function fetchMovieCast(): Promise<void> {
			try {
				const options = {
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: authKey,
					},
				};
				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
					options,
				);
				const data: CreditsResponse = await response.json();

				const castArray = data.cast.slice(0, 10);

				const NewCastList = castArray.map((actor) => {
					return {
						id: String(actor.id),
						name: actor.original_name,
						profilePicture: actor.profile_path,
						character: actor.character,
					};
				});

				setCastList(NewCastList);
			} catch (error) {
				console.log(error);
			}
		}

		fetchMovieCast();
	}, []);

	return (
		<section className='cast'>
			<h2>Top Billed Cast</h2>
			<div className='cast-container'>
				{castList.map((actor) => (
					<Link
						key={actor.id}
						className='actor-container'
						to={`/actor/${actor.id}`}>
						<div className='actor'>
							<div className='profile-picture'>
								{actor.profilePicture === null ? (
									<div className='no-image'>
										<FiCameraOff className='camera' />
										<span>No Image</span>
									</div>
								) : (
									<img
										src={`https://image.tmdb.org/t/p/w185/${actor.profilePicture}`}
										alt={actor.name}
									/>
								)}
							</div>
							<p className='actor-name'>{actor.name}</p>
							<p className='actor-character'>{actor.character}</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};
export default Cast;

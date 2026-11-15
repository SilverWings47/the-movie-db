export type TMDbTypeByTitle = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type TmdbResponseType<T> = {
	page: number;
	results: T[];
	total_pages: number;
	totalResults: string;
};

export interface TmdbTypeById {
	Title: string;
	Year: string;
	Rated: string;
	Released: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Plot: string;
	Language: string;
	Country: string;
	Awards: string;
	Poster: string;
	Ratings: { Source: string; Value: string }[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	Type: 'movie' | 'series' | 'episode';
	DVD?: string;
	BoxOffice?: string;
	Production?: string;
	Website?: string;
	totalSeasons?: string; // series only
	Response: 'True' | 'False';
	Error?: string;
}

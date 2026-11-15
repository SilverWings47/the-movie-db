import { useState } from 'react';
import { Routes, Route } from 'react-router';
import Header from './components/Header';
import MoviePage from './pages/MoviePage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ActorPage from './pages/ActorPage';

export type Movie = {
	id: number;
	title: string;
	year: string;
	poster: string;
	overview: string;
};

function App() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<>
			<Header />
			<Routes>
				<Route
					path='/'
					element={<HomePage />}
				/>
				<Route
					path='/search'
					element={
						<SearchPage
							setMovies={setMovies}
							setIsLoading={setIsLoading}
							movies={movies}
							isLoading={isLoading}
						/>
					}
				/>
				<Route
					path='/movie/:id'
					element={
						<MoviePage
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					}
				/>
				<Route
					path='/actor/:id'
					element={<ActorPage />}
				/>
			</Routes>
		</>
	);
}

export default App;

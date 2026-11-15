import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaMagnifyingGlass } from 'react-icons/fa6';

const Header = () => {
	const [searchInput, setSearchInput] = useState('');
	const navigate = useNavigate();

	return (
		<header>
			<Link to={'/'}>
				<h1 className='logo'>TheMovieDB</h1>
			</Link>
			<form onSubmit={(e) => e.preventDefault()}>
				<input
					value={searchInput}
					onChange={(e) => {
						setSearchInput(e.target.value);
					}}
					type='text'
					placeholder='Search movies, series, shows, actors...'
				/>
				<button
					onClick={() => {
						if (!searchInput) return;
						navigate(`/search?query=${searchInput.trim()}`);
						setSearchInput('');
					}}>
					<FaMagnifyingGlass />
				</button>
			</form>
		</header>
	);
};
export default Header;

import styles   from '../css/blog.css';
import React    from 'react';
import BlogPost from './blogpost.jsx';

export default React.createClass({
	render() {
		document.title = 'AlO.life | Заметки об игре';
		return (
			<main className="blog">
				<BlogPost />
				<BlogPost />
				<BlogPost />
				<BlogPost />
				<BlogPost />
				<BlogPost />
				<BlogPost />
			</main>
		);
	}
});
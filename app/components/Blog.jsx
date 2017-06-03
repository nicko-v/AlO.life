import styles   from '../css/blog.css';
import React    from 'react';
import BlogPost from './BlogPost.jsx';


export default class Blog extends React.Component {
	componentDidMount() {
		document.title = 'AlO.life | Заметки об игре';
	}
	
	render() {
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
}

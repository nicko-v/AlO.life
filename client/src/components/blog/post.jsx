import styles      from './post.css';
import styles_dark from './post.dark.css';
import React       from 'react';


const Post = () =>
	<article className="blog-post">
		<div className="blog-post-header">
			<h3 className="blog-post-header-title">
				<a href="" title="Перейти к посту" className="aNoAnim">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a>
			</h3>
			<time className="blog-post-header-time noselect">03.03.2017&nbsp;в&nbsp;11:32</time>
		</div>
		<ul className="blog-post-manage noselect">
			<li><a href="">Изменить</a></li>
			<li>|</li>
			<li><a href="">Удалить</a></li>
		</ul>
		<div className="blog-post-content">
			<p>Morbi dui tortor, varius eget interdum a, accumsan quis est. Maecenas sit amet tempor dui. Sed dictum lorem eros. Vivamus lobortis libero a dolor congue, nec eleifend justo dapibus. Aliquam erat volutpat. Phasellus velit leo, fermentum ullamcorper pharetra tincidunt, gravida non orci. Ut fringilla odio et ipsum consequat placerat. Vivamus ut turpis pellentesque, lobortis mi at, iaculis diam. Sed sollicitudin ante eget mauris semper, ac luctus magna lobortis. Aenean a sapien ac lectus ultrices tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent nec erat ac mi dignissim molestie. Maecenas volutpat consequat turpis sit amet mollis. Pellentesque eu neque vitae nulla ullamcorper egestas. Nunc congue nec dui id convallis. Nam eget velit ac dolor blandit accumsan at nec neque.</p>
		</div>
	</article>;


export default Post;
import styles from '../css/blog-post.css';
import React  from 'react';


const BlogPost = () =>
	<article className="blogpost">
		<div className="blogpost-header">
			<h3 className="blogpost-header-title">
				<a href="" title="Перейти к посту" className="aNoAnim">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a>
			</h3>
			<time className="blogpost-header-time noselect">03.03.2017&nbsp;в&nbsp;11:32</time>
		</div>
		<ul className="blogpost-manage noselect">
			<li><a href="">Изменить</a></li>
			<li>|</li>
			<li><a href="">Удалить</a></li>
		</ul>
		<div className="blogpost-content">
			<p>Morbi dui tortor, varius eget interdum a, accumsan quis est. Maecenas sit amet tempor dui. Sed dictum lorem eros. Vivamus lobortis libero a dolor congue, nec eleifend justo dapibus. Aliquam erat volutpat. Phasellus velit leo, fermentum ullamcorper pharetra tincidunt, gravida non orci. Ut fringilla odio et ipsum consequat placerat. Vivamus ut turpis pellentesque, lobortis mi at, iaculis diam. Sed sollicitudin ante eget mauris semper, ac luctus magna lobortis. Aenean a sapien ac lectus ultrices tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent nec erat ac mi dignissim molestie. Maecenas volutpat consequat turpis sit amet mollis. Pellentesque eu neque vitae nulla ullamcorper egestas. Nunc congue nec dui id convallis. Nam eget velit ac dolor blandit accumsan at nec neque.</p>
		</div>
	</article>;


export default BlogPost;
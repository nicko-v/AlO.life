/*
	Типы событий:
		- объявление (город объявил о независимости, информация от разработчика)
		- основание  (основание города)
		- открытие   (открытие магазина)
		- конец      (государство прекратило существование, закрылся магазин)
		- ивент      (мероприятие)
*/
export default [
	{
		name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
		descr: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
		type: 'объявление',
		date: {
			year: 2015,
			month: 8,
			day: 13
		}
	},
	{
		name: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
		descr: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		type: 'основание',
		date: {
			year: 2015,
			month: 10,
			day: 28
		}
	},
	{
		name: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
		descr: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur',
		type: 'открытие',
		date: {
			year: 2015,
			month: 12,
			day: 2
		}
	},
	{
		name: 'Duis aute irure dolor in reprehenderit',
		descr: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur',
		type: 'конец',
		date: {
			year: 2016,
			month: 2,
			day: 3
		}
	},
	{
		name: 'In voluptate velit esse cillum dolore eu fugiat nulla pariatur',
		descr: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
		type: 'ивент',
		date: {
			year: 2016,
			month: 2,
			day: 29
		}
	},
	{
		name: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae',
		descr: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
		type: 'ивент',
		date: {
			year: 2016,
			month: 3,
			day: 11
		}
	},
	{
		name: 'Maecenas viverra tortor mauris, et accumsan risus aliquam non. Curabitur eu lectus ligula',
		descr: 'Ut risus ex, volutpat vitae arcu eget, gravida eleifend est.',
		type: 'объявление',
		date: {
			year: 2016,
			month: 4,
			day: 4
		}
	},
	{
		name: 'Vestibulum facilisis, dolor a cursus tincidunt, eros eros vestibulum ipsum, sed porta nulla ante et ligula',
		descr: 'Vestibulum in lectus faucibus, facilisis ante vitae, viverra dui. Mauris nisl orci, pretium eu risus nec, malesuada accumsan risus. Duis nisi libero, vestibulum sit amet mattis in, congue id dolor. Maecenas pulvinar blandit sapien vel bibendum. Phasellus quis scelerisque ipsum. Cras ultricies nibh vel ligula sodales, vestibulum vestibulum dolor posuere. Fusce lorem augue, egestas in malesuada sit amet, dictum et tellus. In consequat, sem rhoncus mollis bibendum, ex orci ornare nibh, vel tincidunt sapien tellus in elit.',
		type: 'основание',
		date: {
			year: 2016,
			month: 10,
			day: 1
		}
	},
	{
		name: 'Curabitur tortor enim, pretium sed sem ut, efficitur iaculis ante',
		descr: '',
		type: 'основание',
		date: {
			year: 2016,
			month: 10,
			day: 1
		}
	},
	{
		name: 'Nulla condimentum massa eu commodo ornare',
		descr: 'In cursus risus ut scelerisque varius. Quisque vehicula ex in nisi blandit laoreet. Maecenas feugiat sit amet nisi vel semper.',
		type: 'основание',
		date: {
			year: 2016,
			month: 10,
			day: 1
		}
	},
	{
		name: 'Vivamus sagittis massa purus, nec volutpat leo pharetra eget',
		descr: 'Duis feugiat semper libero, id mollis risus tristique sit amet.',
		type: 'ивент',
		date: {
			year: 2016,
			month: 11,
			day: 21
		}
	},
	{
		name: 'Sed vel ligula non purus elementum sollicitudin. Fusce auctor, orci sit amet convallis ultrices, massa sapien faucibus quam, a volutpat lorem tortor sed ipsum',
		descr: 'Morbi in laoreet velit. Nunc metus ipsum, sodales sodales enim sit amet, malesuada consectetur leo. Nullam id turpis sed lorem volutpat vulputate. Nunc varius sapien a eros eleifend, sed tincidunt risus tempor. Proin eget dui a metus luctus luctus. Aenean id lacus vestibulum, rhoncus sem sit amet, feugiat felis. Maecenas lobortis urna neque, ac consequat odio finibus eget.',
		type: 'открытие',
		date: {
			year: 2017,
			month: 1,
			day: 13
		}
	},
	{
		name: 'In eget dapibus diam, et bibendum dolor',
		descr: 'Phasellus id eros eleifend arcu tempor placerat. Maecenas congue fringilla auctor. Pellentesque vel tortor dignissim, vulputate urna et, ullamcorper magna. Aenean vitae hendrerit erat.',
		type: 'конец',
		date: {
			year: 2017,
			month: 1,
			day: 14
		}
	},
	{
		name: 'Vestibulum ante ipsum primis in faucibus orci',
		descr: 'Sed porttitor maximus faucibus. Integer feugiat tincidunt purus, quis rutrum tellus tempor a. Donec vulputate scelerisque viverra. Vivamus nec arcu nec risus commodo finibus non ut sapien. Praesent tincidunt egestas blandit. ',
		type: 'основание',
		date: {
			year: 2017,
			month: 1,
			day: 14
		}
	},
	{
		name: 'Nullam et nibh vulputate, rutrum lacus ac, aliquam dui',
		descr: 'Vivamus nisi magna, rhoncus ut libero in, elementum finibus nunc. Cras tincidunt mauris id dui elementum, sit amet laoreet tortor placerat. Nullam eu tortor ac diam sagittis euismod. Curabitur cursus nulla in massa gravida, ut dignissim ipsum accumsan. Morbi suscipit, quam sed gravida lobortis, nibh erat egestas lacus, id vestibulum nisi ex et nibh. Quisque nibh enim, vehicula vel varius vel, dignissim vitae neque. Nullam at orci porta, interdum felis et, egestas justo. Curabitur semper, quam sed hendrerit ultricies, sapien nulla eleifend ante, ut consequat purus augue non erat.',
		type: 'объявление',
		date: {
			year: 2017,
			month: 1,
			day: 19
		}
	}
];
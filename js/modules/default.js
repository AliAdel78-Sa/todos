export const initialLists = [
	{
		settings: {
			id: 1,
			title: "Today",
			isMain: true,
			pinned: false,
			theme: null,
			icon: "assets/svgs/sun.svg",
		},
		tasks: [],
		completedTasks: 0,
		
	},
	{
		settings: {
			id: 2,
			title: "All",
			isMain: true,
			pinned: false,
			theme: null,
			icon: "assets/svgs/all.svg",
		},
		tasks: [],
	},
	{
		settings: {
			id: 3,
			title: "Completed",
			isMain: true,
			pinned: false,
			theme: null,
			icon: "assets/svgs/checked.svg",
		},
		tasks: [],
	},
	{
		settings: {
			id: 4,
			title: "Planned",
			isMain: true,
			pinned: false,
			theme: null,
			icon: "assets/svgs/calendar.svg",
		},
		tasks: [],
	},
	{
		settings: {
			id: 5,
			title: "Tasks",
			isMain: true,
			pinned: false,
			theme: null,
			icon: "assets/svgs/list.svg",
		},
		tasks: [],
	},
];
export const initialSettings = {
	confirmBeforeDeletion: true,
	light: false,
	showAll: true,
	showCompleted: true,
	showPlanned: true,
	playSound: true,
	theme: "blue",
};

export let initialLists = [
	{
		settings: {
			id: "1",
			date: Date.now(),
			title: "Daily Tasks",
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
			id: "2",
			date: Date.now(),
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
			id: "3",
			date: Date.now(),
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
			id: "4",
			date: Date.now(),
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
			id: "5",
			date: Date.now(),
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
	playSound: true,
	theme: "blue",
};

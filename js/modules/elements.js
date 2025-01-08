/**
 * Alias Function for Selecting DOM Elements
 * @param {string} selector The CSS Selector of an html element
 * @param {boolean} selectAll if passed True We Will Do .querySelectorAll() Instead of .querySelector()
 * @returns An Element From The Html By The Selector
 */
const $ = function (selector, selectAll) {
	try {
		if (selectAll === true) {
			const element = document.querySelectorAll(selector);
			if (!element) {
				console.warn(
					`Warning: Element not found for selector "${selector}".`
				);
			} else {
				return element;
			}
		} else {
			const element = document.querySelector(selector);
			if (!element) {
				console.warn(
					`Warning: Element not found for selector "${selector}".`
				);
			} else {
				return element;
			}
		}
	} catch (e) {
		console.log(`Couldn't Get "${selector}"`);
	}
};

// Elements

export const elements = {
	closeNavBtn: $("#close-nav"),
	openNavBtn: $("#open-nav"),
	navBar: $("nav"),
	newListInput: $("#list-input"),
	listInputContainer: $(".add-list-input"),
	taskInput: $("#tasks-input"),
	cornerBtn: $(".add-task-btn"),
	togglers: $(".toggler", true),
	onOff: $(".onOff", true),
	switchBtn: $(".switch", true),
	settingsBar: $(".settings-bar"),
	closeSettingsBar: $(".close-btn-settings"),
	settingsBtn: $(".settings-btn"),
	listsContainer: $("#lists"),
	mainListsContainer: $("#main-lists"),
	listTitle: $("#listTitle"),
	listOptionsMenu: $("#list-options-menu"),
	listOptions: $("#list-options"),
	deleteList: $("#delete-list"),
	renameList: $("#rename-list"),
	renameListInput: $("#renameListInput"),
	changeThemeBtn: $("#change-theme"),
	themeMenu: $(".sub-context-menu"),
	themes: $(".theme", true),
	loader: $("#preloader"),
	addTaskInput: $("#tasks-input"),
	tasksList: $("#tasks-list"),
	headers: $(".list-header", true),
	tasksContainers: $(".tasks-container", true),
	lowList: $(`[priority="low"]`),
	mediumList: $(`[priority="medium"]`),
	highList: $(`[priority="high"]`),
	noList: $(`[priority="no"]`),
	completedList: $("#completedList"),
	links: $(".link", true),
	closeTaskDetails: $("#close-task-details"),
	taskDetails: $(".task-details"),
	deleteTaskBtn: $("#delete-task-btn"),
	editTaskInput: $("#editTaskInput"),
	tasksInputContainer: $(".tasksInput"),
	taskDate: $(".task-date"),
	completeTaskBtn: $("#completeTaskBtn"),
	taskDetailsItem: $("#task-details-item"),
	noteTextArea: $("#noteTextArea"),
	priorityContainer: $(".priority-container"),
	choosePriority: $(".choose-priority"),
	priorityItems: $(".priority-item", true),
	validateIcon: $("#validation-icon"),
	moveTaskBtn: $(".move-task-btn"),
	moveTaskMenu: $(".move-tasks"),
	mainOverlay: $(".main-overlay"),
	secondryOverlay: $(".secondry-overlay"),
	transparentOverlay: $(".transparent-overlay"),
	notifications: $(".notifications"),
	animationcircle: $(".animation-circle"),
	signOutBtn: $("#sign-out-btn"),
	components: [
		$(".tasks-main-container"),
		$(".habits-container"),
		$(".timer-container"),
		$(".search-container"),
		$(".settings-container"),
	],
	barChartBtn: $(".bar_chart"),
	tasksOverview: $(".tasksOverview")
};

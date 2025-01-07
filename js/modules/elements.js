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
	searchBar: $("#search-input"),
	closeSearchBar: $(".close-icon"),
	searchBarIcon: $(".search-icon"),
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
	deleteListBtn: $("#delete-list-btn"),
	cancelDeleteBtn: $("#cancel-list-btn"),
	deleteListModal: $("#delete-list-modal"),
	deleteTaskModal: $("#delete-task-modal"),
	deleteListTitle: $("#delete-list-title"),
	renameListInput: $("#renameListInput"),
	changeThemeBtn: $("#change-theme"),
	themeMenu: $(".sub-context-menu"),
	themes: $(".theme", true),
	loader: $("#preloader"),
	profilePhoto: $(".profile-photo"),
	addTaskInput: $("#tasks-input"),
	tasksList: $("#tasks-list"),
	headers: $(".list-header", true),
	tasksContainers: $(".tasks-container", true),
	lowList: $(`[priority="low"]`),
	mediumList: $(`[priority="medium"]`),
	highList: $(`[priority="high"]`),
	noList: $(`[priority="no"]`),
	completedList: $("#completedList"),
	completetionSound: $("audio"),
	links: $(".link", true),
	closeTaskDetails: $("#close-task-details"),
	taskDetails: $(".task-details"),
	deleteTaskBtn: $("#delete-task-btn"),
	deleteTaskConfirmBtn: $("#deleteTaskConfirmBtn"),
	deleteTaskTitle: $("#delete-task-title"),
	cancelDeleteTaskBtn: $("#cancelTaskConfirmBtn"),
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
	notifyIcon: $("#notify-icon"),
	notification: $(".notification"),
	closeNotifyBtn: $(".close-btn"),
	notificationBody: $(".notification-body"),
	notificationTitle: $(".notification-title"),
	notifications: $(".notifications"),
	animationcircle: $(".animation-circle"),
};

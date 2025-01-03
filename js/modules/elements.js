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
	searchOverlay: $(".input-blur-overlay"),
	closeNavBtn: $("#close-nav"),
	openNavBtn: $("#open-nav"),
	navBar: $("nav"),
	navOverlay: $("#nav-overlay"),
	newListInput: $("#list-input"),
	listInputContainer: $(".add-list-input"),
	taskInput: $("#tasks-input"),
	taskInputOptions: $(".tasksInputOptions"),
	addTaskBtn: $(".add-btn"),
	cornerBtn: $(".add-task-btn"),
	togglers: $(".toggler", true),
	onOff: $(".onOff", true),
	switchBtn: $(".switch", true),
	asideOverlay: $(".aside-overlay"),
	settingsBar: $(".settings-bar"),
	closeSettingsBar: $(".close-btn-settings"),
	settingsBtn: $(".settings-btn"),
	listsContainer: $("#lists"),
	mainListsContainer: $("#main-lists"),
	listTitle: $("#listTitle"),
	listOptionsMenu: $("#list-options-menu"),
	listOptionsOverlay: $(".context-menu-overlay"),
	listOptions: $("#list-options"),
	deleteList: $("#delete-list"),
	renameList: $("#rename-list"),
	listDeleteOverlay: $("#delete-list-overlay"),
	deleteListBtn: $("#delete-list-btn"),
	cancelDeleteBtn: $("#cancel-list-btn"),
	deleteListModal: $(".modal"),
	deleteListTitle: $("#delete-list-title"),
	renameListInput: $("#renameListInput"),
	changeThemeBtn: $("#change-theme"),
	themeMenu: $(".sub-context-menu"),
	themeMenuOverlay: $(".sub-context-menu-overlay"),
	themes: $(".theme", true),
	loader: $("#preloader"),
};

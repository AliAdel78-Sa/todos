import {
	setFirstDayOfWeek,
	firstDayOfWeek,
	setWeekDays,
	weekDays,
} from "../app.js";
import { elements } from "../modules/elements.js";
import { findListById, days } from "./helpers.js";
function adjustWeekDays() {
	setWeekDays([]);

	for (let i = 0; i < 7; i++) {
		const day = {
			name: days[i],
			date: new Date(
				new Date().setDate(firstDayOfWeek + i)
			).toLocaleDateString(),
			week:
				new Date(new Date().setDate(firstDayOfWeek + i)).getMonth() +
				1 +
				"/" +
				new Date(new Date().setDate(firstDayOfWeek + i)).getDate(),
			completedTasks: 0,
			totalTasks: 0,
		};
		weekDays.push(day);
	}
}
function updateWeekDaysStats(dailyList) {
	const weekDaysMap = new Map();
	weekDays.forEach((day) => {
		weekDaysMap.set(day.date, day);
	});
	dailyList.tasks.forEach((task) => {
		const taskDate = new Date(task.date).toLocaleDateString();
		const matchingDay = weekDaysMap.get(taskDate);
		if (matchingDay) {
			if (task.completed) {
				matchingDay.completedTasks++;
			}
			matchingDay.totalTasks++;
		}
	});
	setWeekDays(Object.values(Object.fromEntries(weekDaysMap.entries())));
}
function updateTasksOverview(dailyList) {
	let completedTasks = 0;
	let totalTasks = 0;
	let average = 0;
	adjustWeekDays();
	updateWeekDaysStats(dailyList);
	weekDays.forEach((day) => {
		completedTasks += day.completedTasks;
		totalTasks += day.totalTasks;
	});
	average = Math.round(completedTasks / 7);
	let percentageOfCompleted = "0%";
	if (totalTasks !== 0) {
		percentageOfCompleted =
			Math.round((completedTasks / totalTasks) * 100) + "%";
	}
	setFirstDayOfWeek(firstDayOfWeek - 7);
	let prevcompletedTasks = 0;
	let prevtotalTasks = 0;
	adjustWeekDays();
	updateWeekDaysStats(dailyList);
	weekDays.forEach((day) => {
		prevcompletedTasks += day.completedTasks;
		prevtotalTasks += day.totalTasks;
	});
	let progress = "N/A";
	if (prevcompletedTasks !== 0) {
		progress =
			Math.round(
				((completedTasks - prevcompletedTasks) / prevcompletedTasks) *
					100
			) + "%";
	}
	setFirstDayOfWeek(firstDayOfWeek + 7);
	adjustWeekDays();
	updateWeekDaysStats(dailyList);

	return {
		percentageOfCompleted,
		undone: totalTasks - completedTasks,
		completed: completedTasks,
		progress,
		average,
	};
}
function updateTasksOverviewUI(stats, weekDays) {
	elements.undoneTasks.textContent = stats.undone;
	elements.completedTasks.textContent = stats.completed;
	const bars = document.querySelectorAll(".bar");
	bars.forEach((bar, index) => {
		bar.style.animationName = "";
		let percentage;
		if (weekDays[index].totalTasks !== 0) {
			percentage =
				Math.round(
					(weekDays[index].completedTasks /
						weekDays[index].totalTasks) *
						100
				) + "%";
		} else {
			percentage = "0%";
		}
		setTimeout(() => {
			bar.style.setProperty("--height", percentage);
			if (percentage !== "0%") {
				bar.setAttribute("per", percentage);
				bar.style.setProperty("--padding", "5px");
			}
			bar.style.animationName = "goHigh";
		}, 300);
	});
	elements.growthDecrease.textContent = stats.progress;
	if (stats.progress === "N/A") {
		elements.growthDecreaseMessege.textContent =
			"No Data For The Progress From Last Week";
	} else if (stats.progress[0] === "-") {
		elements.growthDecreaseMessege.textContent = "From Last Week";
	} else {
		elements.growthDecreaseMessege.textContent = "Growth From Last Week";
	}
	elements.percentageText.textContent = stats.percentageOfCompleted;
	elements.percentageCircle.style.setProperty("--gradient-angle", "0%");
	setTimeout(() => {
		elements.percentageCircle.style.setProperty(
			"--gradient-angle",
			stats.percentageOfCompleted
		);
	}, 300);
}
// Events
function statsEvents() {
	elements.barChartBtn.addEventListener("click", () => {
		setFirstDayOfWeek(new Date().getDate() - new Date().getDay());
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
	elements.prevWeek.addEventListener("click", () => {
		setFirstDayOfWeek(firstDayOfWeek - 7);
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
	elements.nextWeek.addEventListener("click", () => {
		setFirstDayOfWeek(firstDayOfWeek + 7);
		updateTasksOverviewUI(updateTasksOverview(findListById("1")), weekDays);
		elements.week.textContent = `${weekDays[0].week}-${
			weekDays[weekDays.length - 1].week
		}`;
	});
}
export {
	adjustWeekDays,
	updateTasksOverview,
	updateTasksOverviewUI,
	updateWeekDaysStats,
	statsEvents,
};

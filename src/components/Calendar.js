import React, { useState, useEffect } from "react";
import "./calendar.css";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = ({ tasks, view, viewChange, onSlotClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());// State to track the currently selected date
  const [showDatePicker, setShowDatePicker] = useState(false);// State to toggle date picker visibility
  const [currentTime, setCurrentTime] = useState(new Date());// State to track current time for updating timeline

  const hours = Array.from({ length: 24 }, (_, i) => i);// Array representing each hour of the day

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update current time every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate the number of days in the current month
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  // Calculate the day of the week the month starts on
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Handle changes to the date input
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate)) {
      setSelectedDate(newDate);
    }
    setShowDatePicker(false);
  };

   // Determine the class name for a day cell based on whether it's today
  const getDayClassName = (day) => {
    const currentDate = new Date();
    const isToday =
      day === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();
    return isToday ? "day-slot today" : "day-slot";
  };

   // Filter tasks for a specific date
  const filterTasksForDate = (date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

   // Render all-day events for a specific date
  const renderAllDayEvents = (date) => {
    const dayTasks = filterTasksForDate(date);
    const allDayTasks = dayTasks.filter((task) => task.allDay);

    return (
      <div className="all-day-events">
        {allDayTasks.map((task) => (
          <div
            key={task.id}
            className="all-day-task"
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick(task);
            }}
          >
            {task.title}
          </div>
        ))}
      </div>
    );
  };

   // Render regular (non-all-day) events for a specific date
  const renderRegularEvents = (date) => {
    const dayTasks = filterTasksForDate(date);
    const regularTasks = dayTasks.filter((task) => !task.allDay);

    return (
      <div className="regular-events">
        {regularTasks.map((task) => (
          <div
            key={task.id}
            className="task"
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick(task);
            }}
          >
            {task.title}
          </div>
        ))}
      </div>
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

 

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="title d-flex">
          
            Today, {selectedDate.toLocaleDateString("en-GB")}
          
          <h4 className="date-selector">
            <FaCalendarAlt
              className="calendar-icon"
              onClick={toggleDatePicker}
            />
            {showDatePicker && (
              <input
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={handleDateChange}
                className="date-input"
              />
            )}
          </h4>
        </div>
        <div className="view-toggle">
          <button
            className={`view-button ${view === "day" ? "active" : ""}`}
            onClick={() => viewChange("day")}
          >
            Day
          </button>
          <button
            className={`view-button ${view === "month" ? "active" : ""}`}
            onClick={() => viewChange("month")}
          >
            Month
          </button>
          <img
            src="./plus.png"
            alt="plus"
            className="add-event-icon"
            onClick={() => onSlotClick(null, selectedDate)}
          />
        </div>
      </div>
      <div className="calendar-body">
        {view === "day" ? (
          <div className="day-view">
            {renderAllDayEvents(selectedDate)}
            <div className="scrollable-events">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={`time-slot ${
                    selectedDate.toDateString() ===
                      currentTime.toDateString() &&
                    hour === currentTime.getHours()
                      ? "current-time"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      !(
                        selectedDate.toDateString() ===
                          currentTime.toDateString() &&
                        hour === currentTime.getHours()
                      )
                    ) {
                      onSlotClick(
                        null,
                        selectedDate,
                        new Date(selectedDate.setHours(hour, 0, 0, 0))
                      );
                    }
                  }}
                >
                  <span>
                    {hour < 12
                      ? `${hour === 0 ? 12 : hour} AM`
                      : `${hour === 12 ? 12 : hour - 12} PM`}
                  </span>
                  <div className="tasks">
                    {filterTasksForDate(selectedDate)
                      .filter(
                        (task) =>
                          !task.allDay &&
                          new Date(task.startTime).getHours() === hour
                      )
                      .map((task) => (
                        <div
                          key={task.id}
                          className="task"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSlotClick(task);
                          }}
                        >
                          {task.title}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="month-view">
            <div className="month-navigation">
              <FaChevronLeft
                className="nav-icon"
                onClick={handlePreviousMonth}
              />
              <span className="month-name">
                {monthNames[selectedDate.getMonth()]}{" "}
                {selectedDate.getFullYear()}
              </span>
              <FaChevronRight className="nav-icon" onClick={handleNextMonth} />
            </div>
            <table className="month-view-table">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  { length: Math.ceil((daysInMonth + firstDayOfMonth) / 7) },
                  (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const day =
                          weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
                        const currentDate = new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          day
                        );
                        return (
                          <td
                            key={dayIndex}
                            className={
                              day > 0 && day <= daysInMonth
                                ? getDayClassName(day)
                                : "empty-day"
                            }
                            onClick={() =>
                              day > 0 &&
                              day <= daysInMonth &&
                              onSlotClick(null, currentDate)
                            }
                          >
                            {day > 0 && day <= daysInMonth ? (
                              <>
                                <span className="day-number">{day}</span>
                                {renderAllDayEvents(currentDate)}
                                {renderRegularEvents(currentDate)}
                              </>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

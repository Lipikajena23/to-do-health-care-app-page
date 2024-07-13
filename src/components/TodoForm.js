import React, { useState, useEffect, useRef } from "react";
import "./TodoForm.css";

const generateTimeOptions = () => {
  const times = [];
  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${adjustedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      times.push(formatTime(hours, minutes));
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();
const repeatOptions = [
  "Does not repeat",
  "Every day",
  "Every week",
  "Every month",
  "Every year",
];
const notificationOptions = [
  "None",
  "5 minutes before",
  "10 minutes before",
  "15 minutes before",
  "1 hours before",
];

const TodoForm = ({ addTask, task, deleteTask, closeForm }) => {
  // State variables for form fields
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("08:30 AM");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState("Does not repeat");
  const [notification, setNotification] = useState("None");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const formRef = useRef(null);

  // Populate form fields with task data when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStartDate(task.date ? new Date(task.date) : null);
      setEndDate(task.date ? new Date(task.date) : null);

      if (task.startTime && task.endTime) {
        const startDateTime = new Date(task.startTime);
        const endDateTime = new Date(task.endTime);

        const formatTime = (date) => {
          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
        };

        setStartTime(formatTime(startDateTime));
        setEndTime(formatTime(endDateTime));
      } else {
        setStartTime("08:00 AM");
        setEndTime("08:30 AM");
      }

      setDescription(task.description);
      setLocation(task.location || "");
      setAllDay(task.allDay || false);
      setRepeat(task.repeat || "Does not repeat");
      setNotification(task.notification || "None");
    }
  }, [task]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      (!allDay && (!startTime || !endTime)) ||
      !startDate ||
      (endDate && endDate < startDate)
    ) {
      alert(
        "Please fill in all required fields and ensure the end date/time is not before the start date/time"
      );
      return;
    }

    const parseTime = (timeString) => {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (hours === 12) {
        hours = 0;
      }
      if (modifier === "PM") {
        hours += 12;
      }
      return { hours, minutes };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    const newTask = {
      id: task ? task.id : Date.now(),
      title,
      date: startDate.toISOString().split("T")[0],
      startTime: allDay
        ? null
        : `${startDate.toISOString().split("T")[0]}T${start.hours
            .toString()
            .padStart(2, "0")}:${start.minutes.toString().padStart(2, "0")}`,
      endTime: allDay
        ? null
        : `${endDate.toISOString().split("T")[0]}T${end.hours
            .toString()
            .padStart(2, "0")}:${end.minutes.toString().padStart(2, "0")}`,
      description,
      location,
      allDay,
      repeat,
      notification,
    };

    addTask(newTask);// Add or update the task
    handleDiscard();// Clear form fields and close form
  };

  // Handle task deletion
  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      handleDiscard(); // Close the form after deleting
    }
  };

  // Clear form fields and close form
  const handleDiscard = () => {
    setTitle("");
    setStartDate(null);
    setEndDate(null);
    setStartTime("08:00 AM");
    setEndTime("08:30 AM");
    setDescription("");
    setLocation("");
    setAllDay(false);
    setRepeat("Does not repeat");
    setNotification("None");
    setIsFullscreen(false);
    closeForm();
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle change in start date
  const handleChangeStartDate = (e) => {
    const selectedDate = e.target.valueAsDate;
    setStartDate(selectedDate);
    if (!endDate || endDate < selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Handle change in end date
  const handleChangeEndDate = (e) => {
    const selectedDate = e.target.valueAsDate;
    if (!selectedDate || selectedDate < startDate) {
      setEndDate(startDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  return (
    <form
      ref={formRef}
      className={`todo-form conatiner ${
        isFullscreen ? "todo-form-fullscreen" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className="todo-header">
        <div onClick={toggleFullscreen}>
          {isFullscreen ? (
            <img src="./shrink.png" alt="shrink" className="imgenlarge" />
          ) : (
            <img src="./enlargeicon.png" alt="enlarge" className="imgenlarge" />
          )}
        </div>
        <img
          src="./close.png"
          alt="close"
          onClick={handleDiscard}
          className="imgenlarge"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="save">
          <i className="fa fa-save mr-2 mt-1"></i>Save
        </button>
        {task && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <i className="fa fa-trash mr-2" aria-hidden="true"></i>Delete
          </button>
        )}
      </div>

      <div className="d-flex m-2">
        <img src="./title.png" alt="title" className="m-2" />
        <input
          type="text"
          placeholder="Add a title"
          value={title}
          className="form-control"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="date-time m-2">
        <img src="./clock.png" alt="clock" className="clock" />
        <div>
          <input
            type="date"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={handleChangeStartDate}
            className="form-control"
          />
        </div>
        {!allDay && (
          <div className="time-input">
            <select
              value={startTime}
              className="form-control"
              onChange={(e) => setStartTime(e.target.value)}
            >
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="toggle-all-day ">
          <label className="switch">
            <input
              type="checkbox"
              checked={allDay}
              onChange={() => setAllDay(!allDay)}
            />
            <span className="slider round"></span>
          </label>
          All day
        </div>
      </div>

      {!allDay && (
        <div className="date-time m-2">
          <div className="date-div">
            <input
              type="date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={handleChangeEndDate}
              className="form-control"
              min={startDate ? startDate.toISOString().split("T")[0] : ""}
            />
          </div>
          <div className="time-input">
            <select
              value={endTime}
              className="form-control"
              onChange={(e) => setEndTime(e.target.value)}
            >
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="repeat-option my-2">
        <select
          value={repeat}
          className="form-control"
          onChange={(e) => setRepeat(e.target.value)}
        >
          {repeatOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="notification-timing d-flex m-2">
        <img src="./timer.png" alt="timer" className="timer" />
        <select
          value={notification}
          className="form-control"
          onChange={(e) => setNotification(e.target.value)}
        >
          {notificationOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="location-input d-flex m-2">
        <img src="./location.png" alt="location" className="location" />
        <input
          type="text"
          placeholder="Add a location"
          value={location}
          className="form-control"
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="d-flex m-2">
        <img src="./description.png" alt="description" className="description" />
        <textarea
          placeholder="Add a description"
          value={description}
          className="form-control"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </form>
  );
};

export default TodoForm;

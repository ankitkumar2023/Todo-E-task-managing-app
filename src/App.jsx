import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [calenderSelectedDate, setCalenderSelectedDate] = useState(null);
  const [addBtn, setAddBtn] = useState("Add");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [viewDivVisible, setViewDivVisible] = useState(false);
  const [completedTodos, setCompletedTodos] = useState(0);
  const [total, setTotal] = useState(0);
  const [isKudosVisible, setIsKudosVisible] = useState(false);

  const topMenuRef = useRef(null);
  const kudosRef = useRef(null);

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateChange = (newdate) => {
    setCalenderSelectedDate(newdate);
    setDate(newdate);
    setIsCalendarVisible(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleAddBtn = () => {
    if (title.trim() === "") {
      alert("Please Add Title First...!");
      return;
    }
    if (text.trim() === "") {
      alert("Empty todo can't be added");
      return;
    }

    if (addBtn === "Update") {
      setAddBtn("Add")
    }

    let newtodo = {
      id: uuidv4(),
      date: date,
      title: title,
      text: text,
      isChecked: false,
    };
    let updated_todo = [...todos, newtodo];
    setTodos(updated_todo);
    setText("");
    setTitle("");

    localStorage.setItem(
      date.toLocaleDateString(),
      JSON.stringify(updated_todo)
    );
  };

  const handleCheckedBox = (id) => {
    let new_todo = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isChecked: !todo.isChecked };
      } else {
        return todo;
      }
    });
    setTodos(new_todo);
  };

  const handleEdit = (id) => {
    todos.find((todo) => {
      if (todo.id === id) {
        setTitle(todo.title);
        setText(todo.text);
      }
    });
    let newTodo = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(newTodo);
  };

  const handleDelete = (id) => {
    let newdeltedTodo = todos.filter((todo) => todo.id !== id);
    setTodos(newdeltedTodo);
  };

  const handleView = (id) => {
    let particularTodo = todos.find((todo) => todo.id === id);
    setSelectedTodo(particularTodo);
    setViewDivVisible(!viewDivVisible);
  };

  const handleCloseView = () => {
    setViewDivVisible(!viewDivVisible);
    setSelectedTodo(null);
  };

  const toggleKudosVisibility = () => {
    setIsKudosVisible(!isKudosVisible);
  };

  const handleKudos = () => {
    const completed = todos.filter((todo) => todo.isChecked).length;
    setCompletedTodos(completed);

    if (todos.length > 0) {
      let efficiency = Math.floor((completed / todos.length) * 100);
      setTotal(efficiency);
    } else {
      setTotal(0); // Avoid division by zero
    }
  };

  useEffect(() => {
    let storedTodos =
      JSON.parse(localStorage.getItem(date.toLocaleDateString())) || [];
    setTodos(storedTodos);
  }, [date]);

  useEffect(() => {
    handleKudos();
  }, [todos]);

  useEffect(() => {
    if (topMenuRef.current && kudosRef.current) {
      // Adjust height when kudos visibility changes
      if (isKudosVisible) {
        topMenuRef.current.style.height = `${kudosRef.current.offsetHeight + 50}px`; // Adjust as needed
      } else {
        topMenuRef.current.style.height = 'auto'; // Reset to auto height
      }
    }
  }, [isKudosVisible]);

  return (
    <div className="min-h-screen h-full bg-gradient-to-r from-blue-100 to-purple-200 p-5">
      <div className="max-w-4xl mx-auto" ref={topMenuRef}>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-700">
              Date: {date.toLocaleDateString()}
            </p>

            <button
              onClick={toggleKudosVisibility}
              className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition"
            >
              {isKudosVisible ? "Hide Kudos" : "Check Kudos"}
            </button>

            <button
              onClick={toggleCalendarVisibility}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
            </button>
          </div>

          {isKudosVisible && (
            <div
              ref={kudosRef}
              className="mt-4 bg-orange-400 mx-auto text-white p-5 rounded-xl text-lg shadow-md"
              style={{ width: '200px' }}
            >
              <h4 className="text-lg font-bold">Todo Stats:</h4>
              <p>Total Todos: {todos.length}</p>
              <p>Completed Todos: {completedTodos}</p>
              <p>Efficiency: {total}%</p>
            </div>
          )}

          {isCalendarVisible && (
            <div className="mt-4">
              <Calendar
                value={date}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add Todo</h2>

          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter Title"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />

          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your Todo here"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg min-h-[100px] focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleAddBtn}
              className="bg-violet-500 text-white py-2 px-4 rounded-lg absolute bottom-6 right-4 hover:bg-violet-600 transition"
            >
              {addBtn}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Todo List</h2>

          {todos.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p>No todos for this date</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-4 shadow-md ${
                  todo.isChecked ? "line-through text-gray-400" : "text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.isChecked}
                  onChange={() => handleCheckedBox(todo.id)}
                  className="w-5 h-5 text-blue-500"
                />

                <div>
                  <p className="font-bold">{todo.title}</p>
                  <p>{todo.text}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(todo.id)}
                    className="bg-yellow-500 hover:bg-orange-400 px-5 py-2 text-lg font-bold rounded-xl hover:rotate-3 transform transition-all duration-300 ease-in-out"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-rose-300 hover:bg-red-400 px-5 py-2 text-lg font-bold rounded-xl hover:rotate-3 transform transition-all duration-300 ease-in-out"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleView(todo.id)}
                    className="bg-cyan-400 hover:bg-blue-500 px-5 py-2 text-lg font-bold rounded-xl hover:rotate-3 transform transition-all duration-300 ease-in-out"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {viewDivVisible && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Todo Details</h2>
            {selectedTodo && (
              <div>
                <p className="font-bold">{selectedTodo.title}</p>
                <p>{selectedTodo.text}</p>
              </div>
            )}
            <button
              onClick={handleCloseView}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

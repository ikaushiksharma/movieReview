import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";

const Header = ({ onAddActorClick, onAddMovieClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];
  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    navigate("/search?title=" + query);
    console.log(query);
  };
  return (
    <div className="flex items-center justify-between relative p-5">
      <AppSearchForm onSubmit={handleSearchSubmit} placeholder="Search Movies" />
      <div className="flex items-center space-x-3">
        <button onClick={toggleTheme} className="dark:text-white text-light-subtle">
          <BsFillSunFill size={24} />
        </button>
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle  border-light-subtle dark:text-dark-subtle  text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        <CreateOptions
          visible={showOptions}
          onClose={() => {
            setShowOptions(false);
          }}
          options={options}
        />
      </div>
    </div>
  );
};

const CreateOptions = ({ options, visible, onClose }) => {
  const containerID = "option-container";
  const container = useRef();
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;
      container.current.classList.remove("animate-scale");
      container.current.classList.add("animate-scale-reverse");
    };
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);
  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("animate-scale-reverse")) onClose();
    e.target.classList.remove("animate-scale");
  };
  const handleClick = (fn) => {
    fn();
  };
  if (!visible) return null;
  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 top-12 z-50 flex flex-col p-5 space-y-3 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={handleAnimationEnd}
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
export default Header;

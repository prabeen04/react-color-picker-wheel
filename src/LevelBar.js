import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./styles/LevelBar.css";

const LevelBar = ({
  alignRight,
  className,
  handleClassName,
  size,
  background,
  onChange,
  value,
}) => {
  const bar = useRef(null);
  const [editing, setEditing] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);

  useEffect(() => {
    const mouseDown = (event) => {
      if (bar.current.contains(event.target)) {
        setCurrentTarget(event);
        setEditing(true);
        const yDifference =
          event.clientX - bar.current.getBoundingClientRect().x;
        const s = (1 - Math.min(size, Math.max(0, yDifference)) / size) * 100;
        onChange(parseFloat(s.toFixed(2)));
      } else {
        setEditing(false);
      }
    };
    const mouseMove = (event) => {
      // console.log(event.clientX, event.clientY);
      if (editing && bar.current.contains(event.target)) {
        setCurrentTarget(event);
        // Y coordinate difference as [0,1] (0 is full saturation)
        const yDifference =
          event.clientX - bar.current.getBoundingClientRect().x;
        const s = (1 - Math.min(size, Math.max(0, yDifference)) / size) * 100;

        onChange(parseFloat(s == 100 ? 99.6 : s.toFixed(2)));
      }
    };
    const mouseUp = () => setEditing(false);

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [editing, onChange, size]);

  const indicatorPosition = useMemo(() => {
    // const top = size * ((0.6 * -1) / 10);
    // const horizontal = size * 0.65;
    if (!currentTarget) return {};
    var top = currentTarget && currentTarget.clientY;
    var horizontal = currentTarget && currentTarget.clientX;
    return { top, horizontal };
  }, [value, size, currentTarget]);
  console.log(indicatorPosition);
  return (
    <div
      ref={bar}
      className={className}
      style={{
        // position: "relative",
        height: 20,
        width: size,
        cursor: "grab",
        // marginTop: "-1.5rem",
      }}
    >
      <div
        className="barBackground"
        style={{
          background,
          marginTop: size / 20,
        }}
      />
      <div
        className={handleClassName}
        style={{
          position: "fixed",
          top: indicatorPosition.top || -1111,
          left: indicatorPosition.horizontal || -1111,
          width: size * 0.05,
          height: size * 0.05,
          border: `${size * 0.005}px solid black`,
        }}
      />
    </div>
  );
};

LevelBar.propTypes = {
  /** Whether bar is aligned to right */
  alignRight: PropTypes.bool,
  /** Css class name for outer div */
  className: PropTypes.string,
  /** Css class name for handle */
  handleClassName: PropTypes.string,
  /** Background in css format */
  background: PropTypes.string,
  /** height of the bar */
  size: PropTypes.number.isRequired,
  /** zero saturation color string in css hsl format (hsl(0, 5%, 10%)). */
  onChange: PropTypes.func,
  /** current value level ([0,100]) */
  value: PropTypes.number,
};

LevelBar.defaultProps = {
  alignRight: false,
  className: "levelBar",
  handleClassName: "defaultHandle",
  background: "black",
  onChange: () => {},
  value: 100,
};
export default LevelBar;

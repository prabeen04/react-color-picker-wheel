import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./styles/LevelBar.css";
import { getXYCordFromTouch } from "./helpers/utils";

const LevelBar = ({
  className,
  handleClassName,
  size,
  background,
  onChange,
  value,
  height,
  paddingFromTop,
}) => {
  const barRef = useRef(null);
  const editingRef = useRef(false);

  useEffect(() => {
    const mouseDown = (event) => {
      editingRef.current = true;
      mouseMove(event);
    };

    const mouseMove = (event) => {
      if (!editingRef.current) {
        return;
      }
      const yDifference =
        getXYCordFromTouch(event).clientX -
        barRef.current.getBoundingClientRect().x;
      const s = (1 - Math.min(size, Math.max(0, yDifference)) / size) * 100;
      onChange(parseFloat(s.toFixed(2)));
    };
    const mouseUp = () => {
      editingRef.current = false;
    };

    const target = barRef.current;

    target.addEventListener("mousedown", mouseDown);
    target.addEventListener("touchstart", mouseDown);

    target.addEventListener("mousemove", mouseMove);
    target.addEventListener("touchmove", mouseMove);

    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("touchend", mouseUp);

    return () => {
      target.removeEventListener("mousedown", mouseDown);
      target.removeEventListener("touchstart", mouseDown);

      target.removeEventListener("mousemove", mouseMove);
      target.removeEventListener("touchmove", mouseMove);

      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("touchend", mouseUp);
    };
  }, [size]);

  const horizontalX = useMemo(() => {
    const horizontal = Math.min(size, Math.max(size - (size * value) / 100, 0));
    return horizontal;
  }, [value, size]);

  return (
    <div
      ref={barRef}
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: height,
        cursor: "grab",
        bottom: -paddingFromTop - height,
      }}
    >
      <div className="barBackground" style={{ background }} />
      <div
        className={handleClassName}
        style={{
          top: "50%",
          left: horizontalX,
          width: height * 0.8,
          height: height * 0.8,
          border: `${height * 0.005}px solid black`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

LevelBar.propTypes = {
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
  className: "levelBar",
  handleClassName: "defaultHandle",
  background: "black",
  onChange: () => {},
  value: 100,
};
export default LevelBar;

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./styles/ColorWheel.css";
import { coordinatesToHS, hsToCoordinates } from "./helpers/utils";
import LevelBar from "./LevelBar";

const ColorWheel = ({ color, size, setColor }) => {
  const wheelRef = useRef(null);
  const editingRef = useRef(false);

  useEffect(() => {
    const mouseDown = (event) => {
      if (wheelRef.current.contains(event.target)) {
        editingRef.current = true;
        mouseMove(event);
      }
    };
    const mouseUp = () => {
      editingRef.current = false;
    };

    const mouseMove = (event) => {
      if (editingRef.current) {
        const color = coordinatesToHS(
          (event.clientX - wheelRef.current.getBoundingClientRect().x) / size,
          (event.clientY - wheelRef.current.getBoundingClientRect().y) / size
        );
        setColor(color);
      }
    };

    const target = wheelRef.current;

    target.addEventListener("mousemove", mouseMove);
    target.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      target.removeEventListener("mousedown", mouseDown);
      target.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [size]);

  const { x, y } = hsToCoordinates(color.h, color.s);

  return (
    <div className="colorWheel">
      <div
        ref={wheelRef}
        className="wheel"
        role="button"
        tabIndex={-5}
        style={{ margin: `0 ${size / 10}px` }}
      >
        <div
          className="handle"
          style={{
            top: y * size,
            left: x * size,
            width: size / 15,
            height: size / 15,
            border: `${size / 150}px solid black`,
          }}
        />
      </div>
      <LevelBar
        alignRight
        className="lightnessBar"
        size={size}
        background={`linear-gradient(to right, white,hsl(${color.h},${color.s}%,50%), black)`}
        onChange={(lightness) =>
          setColor((color) => {
            return { ...color, l: lightness };
          })
        }
        value={color.l}
      />
    </div>
  );
};

ColorWheel.propTypes = {
  /** Current picked color */
  color: PropTypes.shape({
    h: PropTypes.number,
    s: PropTypes.number,
    l: PropTypes.number,
  }),
  /** Size of color wheel */
  size: PropTypes.number.isRequired,
  /** Callback function to set color */
  setColor: PropTypes.func.isRequired,
};

ColorWheel.defaultProps = {
  color: {
    h: 0,
    s: 100,
    l: 50,
  },
};
export default ColorWheel;

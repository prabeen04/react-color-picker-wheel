import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./styles/ColorWheel.css";
import {
  coordinatesToHS,
  getXYCordFromTouch,
  hsToCoordinates,
} from "./helpers/utils";
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
      if (!editingRef.current) {
        return;
      }

      const cord = getXYCordFromTouch(event);
      const color = coordinatesToHS(
        (cord.clientX - wheelRef.current.getBoundingClientRect().x) / size,
        (cord.clientY - wheelRef.current.getBoundingClientRect().y) / size
      );
      setColor(color);
    };

    const target = wheelRef.current;

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

  const { x, y } = hsToCoordinates(color.h, color.s);

  const levelBarHeight = 10;
  const levelBarPadding = 10;
  const wheelSize = size - levelBarHeight * 1 - levelBarPadding * 1;

  return (
    <div
      className="colorWheel"
      style={{
        width: wheelSize,
        height: wheelSize,
      }}
    >
      <div ref={wheelRef} className="wheel" role="button" tabIndex={-5}>
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
        paddingFromTop={levelBarPadding}
        height={levelBarHeight}
        alignRight
        className="lightnessBar"
        size={wheelSize}
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

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

  const levelBarHeight = 10;
  const levelBarPadding = 10;
  const wheelSize = size - (levelBarHeight + levelBarPadding) * 2;

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
        (cord.clientX - wheelRef.current.getBoundingClientRect().x) / wheelSize,
        (cord.clientY - wheelRef.current.getBoundingClientRect().y) / wheelSize
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
  }, [wheelSize]);

  const { x, y } = hsToCoordinates(color.h, color.s);



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
            top: y * wheelSize,
            left: x * wheelSize,
            width: wheelSize / 15,
            height: wheelSize / 15,
            border: `${wheelSize / 150}px solid black`,
          }}
        />
      </div>
      <LevelBar
        paddingFromTop={levelBarPadding}
        height={levelBarHeight}
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

      <LevelBar
        paddingFromTop={levelBarPadding * 2 + levelBarHeight}
        height={levelBarHeight}
        className="saturationBar"
        size={wheelSize}
        background={`linear-gradient(to right, hsl(${color.h},100%,${color.l}%),hsl(${color.h},0%,${color.l}%))`}
        onChange={(saturation) =>
          setColor((color) => {
            return { ...color, s: saturation };
          })
        }
        value={color.s}
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

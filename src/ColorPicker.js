import React, { useCallback, useEffect, useState } from "react";
import "./styles/ColorPicker.css";
import PropTypes from "prop-types";
import ColorWheel from "./ColorWheel";
import { hexToRGB, hslToRgb, rgbToHex, rgbToHsl } from "./helpers/utils";
import LevelBar from "./LevelBar";

const ColorPicker = ({ size, initialColor, onChange }) => {
  const [pickedColor, setPickedColor] = useState({
    hex: "#FF0000",
    rgb: { r: 255, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 50 },
  });

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(initialColor)) {
      const hex = initialColor.toUpperCase();
      const rgb = hexToRGB(initialColor);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setPickedColor({ hex, rgb, hsl });
    } else if (
      Number.isInteger(initialColor.r) &&
      Number.isInteger(initialColor.g) &&
      Number.isInteger(initialColor.b)
    ) {
      const hex = rgbToHex(initialColor.r, initialColor.g, initialColor.b);
      const rgb = initialColor;
      const hsl = rgbToHsl(initialColor.r, initialColor.g, initialColor.b);
      setPickedColor({ hex, rgb, hsl });
    } else {
      setPickedColor({
        hex: "#FF0000",
        rgb: { r: 255, g: 0, b: 0 },
        hsl: { h: 0, s: 100, l: 50 },
      });
    }
  }, [initialColor]);

  const setColorFromWheel = useCallback(
    (hsl) => {
      // console.log({ hsl });
      const h = parseFloat(
        (hsl.h === undefined ? pickedColor.hsl.h : hsl.h).toFixed(2)
      );
      const s = parseFloat(
        (hsl.s === undefined ? pickedColor.hsl.s : hsl.s).toFixed(2)
      );
      const l = parseFloat(
        (hsl.l === undefined ? pickedColor.hsl.l : hsl.l).toFixed(2)
      );
      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setPickedColor({ hex, rgb, hsl: { h, s, l } });
      onChange({ hex, rgb, hsl: { h, s, l } });
    },
    [onChange, pickedColor.hsl]
  );

  return (
    <div>
      <div
        className="outerContainer"
        style={{
          height: size,
          width: size,
        }}
      >
        <ColorWheel
          color={pickedColor.hsl}
          size={size}
          setColor={setColorFromWheel}
        />
      </div>
      <LevelBar
        alignRight
        className="lightnessBar"
        size={size}
        background={`linear-gradient(to right, white,hsl(${pickedColor.hsl.h},${pickedColor.hsl.s}%,50%), black)`}
        onChange={(lightness) => setColorFromWheel({ l: lightness })}
        value={pickedColor.hsl.l}
      />
    </div>
  );
};

ColorPicker.propTypes = {
  /** Size of the container in pixels (Container is a square). */
  size: PropTypes.number,
  /** Color to render onto color wheel. It can be hex(#ffffff) or rgb object({r:0, g:0, b:0}). */
  initialColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      h: PropTypes.number,
      s: PropTypes.number,
      l: PropTypes.number,
    }),
    PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
    }),
  ]),
  /** Function which will be called when color change occurs. Parameter is a hsl object */
  onChange: PropTypes.func,
};

ColorPicker.defaultProps = {
  size: 100,
  initialColor: "#FF0000",
  onChange: () => {},
};

export default ColorPicker;

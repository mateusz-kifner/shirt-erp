import useTranslation from "@/hooks/useTranslation";
import equalHSV from "@/utils/equalHSV";
import { useEyeDropper } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconColorPicker,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import tinycolor2, { type ColorFormats } from "tinycolor2";
import ActionButton from "../ui/ActionButton";
import AlphaSlider from "./AlphaSlider";
import ColorArea from "./ColorArea";
import ColorSwatches from "./ColorSwatches";
import HueSlider from "./HueSlider";
import colors from "./colors.json";
import useColor from "./useColor";

interface InputColorProps {
  value?: ColorFormats.HSVA;
  onChange: (value: ColorFormats.HSVA) => void;
  disabled?: boolean;
}

function InputColor(props: InputColorProps) {
  const { value, onChange, disabled } = props;
  const { supported, open } = useEyeDropper();
  const [swatchesLoaded, setSwatchesLoaded] = useState<boolean>(false);
  const [openPalette, setOpenPalette] = useState<boolean>(false);

  const [isActiveArea, setIsActiveArea] = useState<boolean>(false);
  const [isActiveHue, setIsActiveHue] = useState<boolean>();
  const [isActiveAlpha, setIsActiveAlpha] = useState<boolean>(false);

  const isActive = isActiveArea || isActiveHue || isActiveAlpha;

  const t = useTranslation();

  const { color, getRGBA, setHSV, getHSV, setHex, getHex8 } = useColor(
    value,
    onChange
  );

  const colorRGBA = getRGBA();

  const [RGBAText, setRGBAText] = useState<{
    r: string;
    g: string;
    b: string;
    a: string;
  }>({
    r: colorRGBA.r.toFixed(0),
    g: colorRGBA.g.toFixed(0),
    b: colorRGBA.b.toFixed(0),
    a: Math.floor(colorRGBA.a * 100).toFixed(0),
  });

  const [HSVText, setHSVText] = useState<{
    h: string;
    s: string;
    v: string;
    a: string;
  }>({
    h: color.h.toFixed(0),
    s: color.s.toString(),
    v: color.v.toString(),
    a: Math.floor(color.a * 100).toFixed(0),
  });

  useEffect(() => {
    const colorHSV = getHSV();
    if (!!value && !equalHSV(colorHSV, value)) {
      setHSV(value);
    }
  }, [value]);

  const updateHSVandHSVText = (RGBAText: {
    r: string;
    g: string;
    b: string;
    a: string;
  }) => {
    const newColor = tinycolor2.fromRatio({
      r: parseInt(RGBAText.r),
      g: parseInt(RGBAText.g),
      b: parseInt(RGBAText.b),
      a: parseInt(RGBAText.a) / 100,
    });

    if (newColor.isValid() && !isActive) {
      const newColorHSV = newColor.toHsv();
      setHSV({ ...newColorHSV, h: newColorHSV.h / 360 });
      setHSVText({
        h: newColorHSV.h.toFixed(0),
        s: newColorHSV.s.toFixed(3),
        v: newColorHSV.v.toFixed(3),
        a: (newColorHSV.a * 100).toFixed(0),
      });
    }
  };

  const updateHSVandRGBAText = (HSVText: {
    h: string;
    s: string;
    v: string;
    a: string;
  }) => {
    const newColor = tinycolor2.fromRatio({
      h: parseFloat(HSVText.h) / 360,
      s: parseFloat(HSVText.s),
      v: parseFloat(HSVText.v),
      a: parseFloat(HSVText.a) / 100,
    });
    if (newColor.isValid() && !isActive) {
      const newColorRGB = newColor.toRgb();
      const newColorHSV = newColor.toHsv();
      setHSV({ ...newColorHSV, h: newColorHSV.h / 360 });
      setRGBAText({
        r: newColorRGB.r.toFixed(0),
        g: newColorRGB.g.toFixed(0),
        b: newColorRGB.b.toFixed(0),
        a: Math.floor(newColorRGB.a * 100).toFixed(0),
      });
    }
  };

  const updateRGBATextandHSVText = (color: ColorFormats.HSVA) => {
    const newColor = tinycolor2.fromRatio(color);
    const newColorRGBA = newColor.toRgb();
    const newColorHSV = newColor.toHsv();
    setRGBAText({
      r: newColorRGBA.r.toFixed(0),
      g: newColorRGBA.g.toFixed(0),
      b: newColorRGBA.b.toFixed(0),
      a: Math.floor(newColorRGBA.a * 100).toFixed(0),
    });
    setHSVText({
      h: newColorHSV.h.toFixed(0),
      s: newColorHSV.s.toFixed(3),
      v: newColorHSV.v.toFixed(3),
      a: Math.floor(newColorHSV.a * 100).toFixed(0),
    });
  };

  const pickColor = async () => {
    try {
      const { sRGBHex } = await open();
      setHex(sRGBHex);
      const newColor = tinycolor2(sRGBHex);
      updateRGBATextandHSVText(newColor.toHsv());
    } catch (e) {
      console.log(e);
    }
  };

  const colorHex = getHex8();

  return (
    <div className={`relative flex w-[388px] flex-col gap-3 p-3 `}>
      <div className={`flex gap-3 ${openPalette ? "overflow-hidden" : ""}`}>
        <ColorArea
          value={getHSV()}
          onChange={(color) => {
            setHSV(color);
            updateRGBATextandHSVText(color);
          }}
          disabled={disabled}
          onActive={setIsActiveArea}
        />
        <div className="flex flex-grow flex-col gap-3">
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              borderRadius: 6,
              background:
                'url("/assets/checkerboard.svg") 0px 0px/16px 16px repeat',
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                background: colorHex.substring(0, 7),
              }}
            ></div>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                background: colorHex,
              }}
            ></div>
          </div>
          <div className="flex justify-between gap-3">
            <div className="flex flex-col gap-3">
              <label>
                {"R : "}
                <input
                  className="w-9  border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-red-500"
                  value={RGBAText.r}
                  onChange={(e) => {
                    const newColor = { ...RGBAText, r: e.target.value };
                    setRGBAText(newColor);
                    updateHSVandHSVText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>
              <label>
                {"G : "}
                <input
                  className="w-9  border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-green-500"
                  value={RGBAText.g}
                  onChange={(e) => {
                    const newColor = { ...RGBAText, g: e.target.value };
                    setRGBAText(newColor);
                    updateHSVandHSVText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>
              <label>
                {"B : "}
                <input
                  className="w-9 border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-blue-500"
                  value={RGBAText.b}
                  onChange={(e) => {
                    const newColor = { ...RGBAText, b: e.target.value };
                    setRGBAText(newColor);
                    updateHSVandHSVText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>
              <label>
                {"A : "}
                <input
                  className="w-9 border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-yellow-500"
                  value={RGBAText.a}
                  onChange={(e) => {
                    const newColor = { ...RGBAText, a: e.target.value };
                    setRGBAText(newColor);
                    updateHSVandHSVText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <label>
                {"H : "}
                <input
                  className="w-12  border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-violet-500"
                  value={HSVText.h}
                  onChange={(e) => {
                    const newColor = { ...HSVText, h: e.target.value };
                    setHSVText(newColor);
                    updateHSVandRGBAText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>
              <label>
                {"S : "}
                <input
                  className="w-12  border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-cyan-500"
                  value={HSVText.s}
                  onChange={(e) => {
                    const newColor = { ...HSVText, s: e.target.value };
                    setHSVText(newColor);
                    updateHSVandRGBAText(newColor);
                  }}
                />
              </label>
              <label>
                {"V : "}
                <input
                  className="w-12 border-b border-b-stone-400 bg-transparent text-right outline-none focus-visible:border-b-fuchsia-500"
                  value={HSVText.v}
                  onChange={(e) => {
                    const newColor = { ...HSVText, v: e.target.value };
                    setHSVText(newColor);
                    updateHSVandRGBAText(newColor);
                  }}
                  disabled={disabled}
                />
              </label>

              <ActionButton
                className="self-end"
                onClick={() => {
                  pickColor().catch((e) => console.log(e));
                }}
                disabled={!supported || disabled}
              >
                <IconColorPicker />
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pb-7">
        <HueSlider
          value={getHSV()}
          onChange={(color) => {
            setHSV(color);
            updateRGBATextandHSVText(color);
          }}
          onActive={setIsActiveHue}
          disabled={disabled}
        />
        <AlphaSlider
          value={getHSV()}
          onChange={(color) => {
            setHSV(color);
            updateRGBATextandHSVText(color);
          }}
          onActive={setIsActiveAlpha}
          disabled={disabled}
        />
      </div>
      <div
        className={`absolute bottom-0 left-0 flex w-full flex-col gap-3  overflow-hidden bg-stone-200 transition-all dark:bg-stone-950 ${
          openPalette ? "h-full p-3" : "h-7 px-3"
        }`}
      >
        <button
          className="inline-flex
          h-8
          select-none 
          items-center 
          justify-center
          gap-3
          rounded-md 
          bg-transparent 
          stroke-gray-200 
          px-4 
          py-0
          font-semibold 
          uppercase
          text-stone-800  
          no-underline 
          outline-offset-4 
          transition-all 
          hover:bg-black 
          hover:bg-opacity-30 
          focus-visible:outline-sky-600 
          disabled:pointer-events-none
          disabled:bg-stone-700 
          dark:bg-transparent 
          dark:text-stone-200 
          dark:hover:bg-white
          dark:hover:bg-opacity-30 
          dark:first-letter:hover:bg-white

          "
          onClick={() => {
            if (!swatchesLoaded) setSwatchesLoaded(true);
            setOpenPalette((val) => !val);
          }}
          disabled={disabled}
        >
          {t.color_palette}
          {openPalette ? <IconChevronDown /> : <IconChevronUp />}
        </button>
        {(swatchesLoaded || openPalette) && (
          <ColorSwatches
            onClick={(val) => {
              setHex(val);
              setOpenPalette(false);
            }}
            colors={colors}
            className={openPalette ? "" : "hidden"}
          />
        )}
      </div>
    </div>
  );
}

export default InputColor;

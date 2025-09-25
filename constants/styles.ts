import { wp } from "@/utils";
import { PixelRatio } from "react-native";

/* fonts */
export const FontFamily = {
  InterRegular: "InterRegular",
  InterMedium: "InterMedium",
  InterSemiBold: "InterSemiBold",
  InterBold: "InterBold",
  InterExtraBold: "InterExtraBold",
  LatoLight: "LatoLight",
  LatoRegular: "LatoRegular",
};

const adjustfontSize = (size: number) => {
  return wp(size) / PixelRatio.getFontScale();
};

/* font sizes */
export const FontSize = {
  xxs: adjustfontSize(2.3),
  xs: adjustfontSize(2.6),
  s: adjustfontSize(3.2),
  m: adjustfontSize(3.6),
  l: adjustfontSize(4.1),
  xl: adjustfontSize(4.6),
  xxl: adjustfontSize(5.1),
  xxxl: adjustfontSize(5.6),
  xxxxl: adjustfontSize(6),
};

export const Colors = {
  bg_auth: "#162338",
  bg_home: "#10274F",
  bg_bottom_tab: "#031F3D",
  bg_blue_card: "rgba(19, 50, 106, 1)",
  bg_blue_card_workspace: "rgba(13, 61, 110, 1)",
  blue_text: "#2A6F97",
  blue_text2: "rgb(8, 10, 14)",
  blue_line: "#1B3667",
  blue_icons: "rgba(41, 85, 160, 1)",
  active_button: "#2A5198",
  active_dropdown_item: "rgba(22,55,103,0.2)",
  white: "#fff",
  black: "black",
  light_black: "rgba(82, 82, 82, 1)",
  search_placeholder: "#aaa",
  placeholder: "#525252",
  error: "#FF4E4E",
  gray: "rgba(128, 128, 128, 1)",
  lightGray: "rgba(196, 196, 196, 0.4)",
  primary: "#2A5198",
  dark_gray_border: "#344563",
  gray_border: "rgba(196, 196, 196, 1)",
  light_gray_border: "rgba(196, 196, 196, 0.4)",
  gray_field_bg: "rgba(231, 233, 235, 1)",
};

export const TextStyles = {
  error_msg: {
    fontSize: FontSize.s,
    fontFamily: FontFamily.InterRegular,
    color: Colors.error,
  },
};

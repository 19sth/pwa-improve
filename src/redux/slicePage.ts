import { INavItem } from "../components/mulayout";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { APP_NAME } from "../utils/constants";

export interface IModalButton {
  label: string;
  func: ()=>void;
}

export interface IModal {
  show: boolean;
  title: string;
  text: string;
  buttons: IModalButton[];
}

export interface IHeader {
  navItems: INavItem[];
  title: string;
}

export interface PageState extends IHeader{
  modal: IModal;
}

const initialState: PageState = {
  navItems: [],
  modal: {show: false} as IModal,
  title: "",
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    updatePageState: (state, action: PayloadAction<IHeader>) => {
      state.navItems = action.payload.navItems;
      state.title = `${APP_NAME} ${
        action.payload.title ? " - " + action.payload.title : ""
      }`.toLowerCase();
    },
    updateModal: (state, action: PayloadAction<IModal>) => {
      state.modal = action.payload;
    }
  },
});

export const { updatePageState, updateModal } = pageSlice.actions;

export default pageSlice.reducer;

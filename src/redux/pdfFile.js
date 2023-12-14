import { createSlice } from "@reduxjs/toolkit";

let INITIAL_STATE = { pdfFileId: '' }

const pdfFileIdSlice = createSlice({
    name: 'pdfFileId',
    initialState: INITIAL_STATE,
    reducers: {
        setPdfFileId: (state, action) => {
            state.pdfFileId = action.payload;
        },
        resetFileIdState: (state) => {
            state.pdfFileId = '';
        }
    }
});

export const { setPdfFileId, resetState } = pdfFileIdSlice.actions
export default pdfFileIdSlice.reducer;
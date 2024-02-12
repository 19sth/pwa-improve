import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface ITargetRecord {
  date: string
  value: number
}

function removeRecordsByDate(records: ITargetRecord[], date: string) {
  let ixToRemove = [] as number[];
  records.forEach((e,ix) => {
    if (e.date === date) {
      ixToRemove.push(ix);
    }
  });
  ixToRemove = ixToRemove.reverse()
  ixToRemove.forEach(e=>{
    records.splice(e,1)
  })
}

export interface IAddTargetRecord {
  id: number
  record: ITargetRecord
}

export interface ITargetItem {
  id: number
  name: string
  startDate: string
  endDate: string
  targetReached: boolean
  initialValue: number
  targetValue: number
  records: ITargetRecord[]
}

export interface TargetState {
  targets: ITargetItem[]
}

const initialState: TargetState = {
  targets: []
};

export const targetSlice = createSlice({
  name: "target",
  initialState,
  reducers: {
    addNewTarget: (state, action: PayloadAction<ITargetItem>) => {
      const newTarget = action.payload;
      let newId = 0;
      if (state.targets.length > 0) {
        newId = state.targets[state.targets.length-1].id + 1
      }
      newTarget.id = newId;
      state.targets.push(newTarget);
    },
    addNewRecord: (state, action: PayloadAction<IAddTargetRecord>) => {
      for (let i = 0; i < state.targets.length; i++) {
        if (state.targets[i].id === action.payload.id) {
          const records = state.targets[i].records;
          records.push(action.payload.record);
          records.sort((a,b)=>(a.date > b.date)?1:-1);
          
          if (Number.isNaN(action.payload.record.value)) {
            removeRecordsByDate(records, action.payload.record.date);
          }

          state.targets[i].records = records;
        }
      }
    }
  },
});

export const { addNewTarget, addNewRecord } = targetSlice.actions;

export default targetSlice.reducer;

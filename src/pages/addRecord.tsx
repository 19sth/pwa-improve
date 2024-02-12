import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { Button, FormControl, InputLabel, TextField } from "@mui/material";
import MuTakoz from "../components/mutakoz";
import { addDays, parseISO, startOfDay } from "date-fns";
import { addNewRecord, addNewTarget } from "../redux/sliceTarget";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";

export default function AddRecord() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [date, setDate] = useState(startOfDay(new Date()).toISOString());
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "Add Record",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <MuTakoz />

      <FormControl fullWidth>
        <DatePicker
          label="Controlled picker"
          value={parseISO(date)}
          onChange={(newDate) =>
            setDate(startOfDay(newDate || 0).toISOString() || "")
          }
        />
      </FormControl>

      <MuTakoz />

      <TextField
        label="Initial"
        variant="outlined"
        className="w-full"
        type="number"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setValue(Number.parseFloat(e.target.value));
        }}
      />
      <MuTakoz height={"5rem"} />
      <Button variant="contained" className="w-full" onClick={() => {
        dispatch(
          addNewRecord({
            id: parseInt(id || "-1"),
            record: {
              date: date,
              value: value
            }
          })
        )
        navigate(-1);
      }}>
        ADD NEW RECORD
      </Button>
    </div>
  );
}

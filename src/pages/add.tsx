import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import MuTakoz from "../components/mutakoz";
import { addDays, startOfDay } from "date-fns";
import { addNewTarget } from "../redux/sliceTarget";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(
    startOfDay(new Date()).toISOString()
  );
  const [initialValue, setInitialValue] = useState(0);
  const [targetValue, setTargetValue] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "Add",
      })
    );
  }, [dispatch]);

  const today = startOfDay(new Date());

  return (
    <div>
      <MuTakoz />
      <TextField
        label="Name"
        variant="outlined"
        className="w-full"
        autoComplete="off"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <MuTakoz />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Start Day</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Start Day"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        >
          <MenuItem value={addDays(new Date(today), -2).toISOString()}>
            The Day Before
          </MenuItem>
          <MenuItem value={addDays(new Date(today), -1).toISOString()}>
            Yesterday
          </MenuItem>
          <MenuItem value={today.toISOString()}>Today</MenuItem>
          <MenuItem value={addDays(new Date(today), 1).toISOString()}>
            Tomorrow
          </MenuItem>
          <MenuItem value={addDays(new Date(today), 2).toISOString()}>
            The Day After
          </MenuItem>
        </Select>
      </FormControl>

      <MuTakoz />

      <TextField
        label="Initial"
        variant="outlined"
        className="w-full"
        type="number"
        autoComplete="off"
        value={initialValue}
        onChange={(e) => {
          setInitialValue(Number.parseFloat(e.target.value));
        }}
      />
      <MuTakoz />
      <TextField
        label="Target"
        variant="outlined"
        className="w-full"
        type="number"
        autoComplete="off"
        value={targetValue}
        onChange={(e) => {
          setTargetValue(Number.parseFloat(e.target.value));
        }}
      />
      <MuTakoz height={"5rem"} />
      <Button
        variant="contained"
        className="w-full"
        onClick={() => {
          dispatch(
            addNewTarget({
              id: -1,
              name,
              startDate,
              initialValue,
              targetValue,
              records: [],
            })
          );
          navigate(-1);
        }}
      >
        ADD NEW TASK
      </Button>
    </div>
  );
}

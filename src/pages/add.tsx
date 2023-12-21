import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import MuTakoz from "../components/mutakoz";

export default function Add() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "Add",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <MuTakoz />
      <TextField label="Name" variant="outlined" className="w-full" />
      <MuTakoz />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Start Day</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Start Day"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <MuTakoz/>

      <TextField
        label="Initial"
        variant="outlined"
        className="w-full"
        type="number"
      />
      <MuTakoz />
      <TextField
        label="Goal"
        variant="outlined"
        className="w-full"
        type="number"
      />
      <MuTakoz height={"5rem"} />
      <Button variant="contained" className="w-full">
        ADD NEW TASK
      </Button>
    </div>
  );
}

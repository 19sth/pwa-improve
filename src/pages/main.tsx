import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { RadioButtonUnchecked } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";

export default function Main() {
  const targets = useSelector((rootState: RootState) => rootState.target.targets);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          { icon: "ImportExport", link: "./importexport" },
          { icon: "Add", link: "./add" },
        ],
        title: "",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <List>
        {targets.map((e) => (
          <Link key={`target_item_${e.id}`} to={`./detail/${e.id}`}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: (e.targetReached)? "#c2f0c2" : "#ffb3b3" }}>
                  <RadioButtonUnchecked sx={{ color: "black" }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={e.name} secondary={
                `${e.initialValue} >> ${e.targetValue}`
              } />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </div>
  );
}

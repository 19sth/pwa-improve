import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { ITargetItem } from "../redux/sliceTarget";
import { Button } from "@mui/material";
import { LineChart } from "@mui/x-charts";

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [thisTarget, setThisTarget] = useState({} as ITargetItem);

  const targets = useSelector(
    (rootState: RootState) => rootState.target.targets
  );

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          {
            icon: "Add",
            link: `./add-record/${thisTarget.id}`,
          },
        ],
        title: "Add",
      })
    );
  }, [dispatch, thisTarget]);

  useEffect(() => {
    if (targets && targets.length > 0 && id) {
      const localTarget = targets.filter((e) => e.id === Number.parseInt(id));
      if (localTarget.length > 0) {
        setThisTarget(localTarget[0] as ITargetItem);
        let localActualPoints = [];
        localTarget[0].records.forEach((e, ix) => {
          localActualPoints.push([ix, e.value]);
        });
      } else {
        navigate(-1);
      }
    }
  }, [id, navigate, targets]);

  return (
    <div>
      {thisTarget.name}
      <LineChart
        series={[
          { curve: "linear", data: [0, 5, 2, 6, 3, 9.3] },
          { curve: "linear", data: [6, 3, 7, 9.5, 4, 2] },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
}

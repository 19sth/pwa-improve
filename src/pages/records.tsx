import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IModal, updateModal, updatePageState } from "../redux/slicePage";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { ITargetItem, ITargetRecord, deleteTarget } from "../redux/sliceTarget";
import {
  ChartContainer,
  ChartsLegend,
  ChartsReferenceLine,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
} from "@mui/x-charts";
import { linearRegression, linearRegressionLine } from "simple-statistics";
import { differenceInDays, eachDayOfInterval, format, max } from "date-fns";
import MuTakoz from "../components/mutakoz";

interface IChartData {
  date: Date;
  actual: number;
  regression: number;
}

interface IReggLine {
  m: number;
  b: number;
}

export default function Records() {
  const dispatch = useDispatch();
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
        title: "Records",
      })
    );
  }, [dispatch, thisTarget]);

  useEffect(() => {
    if (targets && targets.length > 0 && id) {
      const localTarget = targets.filter((e) => e.id === Number.parseInt(id));
      if (localTarget.length > 0) {
        setThisTarget(localTarget[0]);
      }
    }
  }, [id, targets]);

  if (!thisTarget.targetValue) {
    return <></>;
  }

  return (
    <div>
      {thisTarget.records.map((e) => (
        <div key={e.date} className="grid grid-cols-5 gap-1 border-b-4 mt-3">
          <div className="col-span-4">
            {format(new Date(e.date), "MMMM do, Y, EEEE")}
          </div>
          <div className="col-span-1 text-center">{e.value}</div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { ITargetItem } from "../redux/sliceTarget";
import { ChartContainer, ChartsReferenceLine, ChartsXAxis, ChartsYAxis, LineChart, LineHighlightPlot, LinePlot, MarkPlot } from "@mui/x-charts";
import { linearRegression, linearRegressionLine } from "simple-statistics";
import { format } from "date-fns";

interface IChartData {
  date: Date;
  actual: number;
  regression: number;
}

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [thisTarget, setThisTarget] = useState({} as ITargetItem);
  const [chartData, setChartData] = useState([] as IChartData[]);

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
        const regg = linearRegression(
          localTarget[0].records.map((e, ix) => [ix, e.value])
        );
        const localChartData = localTarget[0].records.map(
          (e, ix) =>
            ({
              date: new Date(e.date),
              actual: e.value,
              regression: linearRegressionLine(regg)(ix),
            } as IChartData)
        );
        setChartData(localChartData);
      } else {
        navigate(-1);
      }
    }
  }, [id, navigate, targets]);

  if (!thisTarget.targetValue) {
    return (<></>)
  }

  return (
    <div>
      <div className="text-2xl font-light">
       task &nbsp;
       <span className="font-bold">
        {thisTarget.name}
       </span>
      </div>
      <ChartContainer
        series={[
          { type: "line", label:"Actual", data: chartData.map((e) => e.actual) },
          { type: "line", label:"Prediction", data: chartData.map((e) => e.regression) },
          {
            type: "line",
            data: chartData.map((e) => thisTarget.targetValue),
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: chartData.map(
              (e) => format(e.date, "LLL d")
            ),
          },
        ]}
        width={520}
        height={250}
      >

      <LinePlot/>

      
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsReferenceLine y={thisTarget.targetValue} label="Target" lineStyle={{ stroke: 'red' }} />

      </ChartContainer>
    </div>
  );
}

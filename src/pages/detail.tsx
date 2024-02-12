import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { ITargetItem, ITargetRecord } from "../redux/sliceTarget";
import {
  ChartContainer,
  ChartsLegend,
  ChartsReferenceLine,
  ChartsXAxis,
  ChartsYAxis,
  LineChart,
  LineHighlightPlot,
  LinePlot,
  MarkPlot,
} from "@mui/x-charts";
import { linearRegression, linearRegressionLine } from "simple-statistics";
import { eachDayOfInterval, format, max } from "date-fns";
import MuTakoz from "../components/mutakoz";

interface IChartData {
  date: Date;
  actual: number;
  regression: number;
}

function interpolateRecords(records: ITargetRecord[]) {
  const dayInterval = eachDayOfInterval({
    start: new Date(records[0].date),
    end: max([
      new Date(
        records[records.length - 1].date
      ),
      new Date()
    ]),
  }).map(e=>e.toISOString());

  const newRecords = [];
  let i = 0;
  let j = 0;
  while (j < dayInterval.length) {
    if (dayInterval[j] >= records[i].date) {
      newRecords.push({
        date: dayInterval[j],
        value: records[i].value
      } as ITargetRecord)
      i = (Math.min(i+1, records.length-1));
      j++;
    } else if (dayInterval[j] < records[i].date) {
      newRecords.push({
        date: dayInterval[j],
        value: records[i-1].value
      } as ITargetRecord)
      j++;
    }
  }

  return newRecords;
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
        const localRecords = interpolateRecords(localTarget[0].records);

        const regg = linearRegression(
          localRecords.map((e, ix) => [ix, e.value])
        );
        const localChartData = localRecords.map(
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
    return <></>;
  }

  return (
    <div>
      <ChartContainer
        series={[
          {
            type: "line",
            label: "Actual",
            data: chartData.map((e) => e.actual),
          },
          {
            type: "line",
            label: "Prediction",
            data: chartData.map((e) => e.regression),
          },
          {
            type: "line",
            data: chartData.map((e) => thisTarget.targetValue),
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: chartData.map((e) => format(e.date, "LLL d")),
          },
        ]}
        width={520}
        height={250}
      >
        <LinePlot />

        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsLegend/>
        <ChartsReferenceLine
          y={thisTarget.targetValue}
          label="Target"
          lineStyle={{ stroke: "red" }}
        />
      </ChartContainer>
      <MuTakoz/>
      <div className="text-2xl font-light">
        task &nbsp;
        <span className="font-bold">{thisTarget.name}</span>
      </div>
    </div>
  );
}

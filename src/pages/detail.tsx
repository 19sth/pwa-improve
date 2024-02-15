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

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [thisTarget, setThisTarget] = useState({} as ITargetItem);
  const [chartData, setChartData] = useState([] as IChartData[]);
  const [analyticsData, setAnalyticsData] = useState(
    [] as { label: string; value: string }[]
  );

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
        setThisTarget(localTarget[0]);
        const localRecords = interpolateRecords(localTarget[0].records);
        const regg = linearRegression(
          localRecords.map((e, ix) => [ix, e.value])
        );
        setAnalyticsData(prepareAnalyticsData(localTarget[0], regg));
        setChartData(prepareChartData(localRecords, regg));
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
            data: chartData.map(() => thisTarget.targetValue),
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: chartData.map((e) => format(e.date, "LLL d")),
          },
        ]}
        width={Math.min(560, window.innerWidth - 30)}
        height={250}
      >
        <LinePlot />

        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsLegend />
        <ChartsReferenceLine
          y={thisTarget.targetValue}
          label="Target"
          lineStyle={{ stroke: "red" }}
        />
      </ChartContainer>
      <MuTakoz />
      {analyticsData.map((e) => (
        <div
          className="grid grid-cols-5 gap-1 text-xl font-light px-10 py-1"
          key={e.label}
        >
          <div className="col-span-3"> {e.label} </div>
          <div className="font-bold text-right col-span-2"> {e.value} </div>
        </div>
      ))}

      <div className="px-6">
        <div className="text-lg mt-5">Records</div>
        <div
          className="rounded-lg border border-1 px-5"
          style={{ height: 200, overflowY: "auto" }}
        >
          {thisTarget.records.map((e) => (
            <div key={e.date} className="grid grid-cols-5 gap-1 border-b-4 mt-3">
              <div className="col-span-4">
                {format(new Date(e.date), "MMMM do, Y, EEEE")}
              </div>
              <div className="col-span-1 text-center">
                {e.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function interpolateRecords(records: ITargetRecord[]) {
  const dayInterval = eachDayOfInterval({
    start: new Date(records[0].date),
    end: max([new Date(records[records.length - 1].date), new Date()]),
  }).map((e) => e.toISOString());

  const newRecords = [];
  let i = 0;
  let j = 0;
  while (j < dayInterval.length) {
    if (dayInterval[j] >= records[i].date) {
      newRecords.push({
        date: dayInterval[j],
        value: records[i].value,
      } as ITargetRecord);
      i = Math.min(i + 1, records.length - 1);
      j++;
    } else if (dayInterval[j] < records[i].date) {
      newRecords.push({
        date: dayInterval[j],
        value: records[i - 1].value,
      } as ITargetRecord);
      j++;
    }
  }

  return newRecords;
}

function prepareChartData(
  interpolatedRecords: ITargetRecord[],
  regg: IReggLine
) {
  return interpolatedRecords.map(
    (e, ix) =>
      ({
        date: new Date(e.date),
        actual: e.value,
        regression: linearRegressionLine(regg)(ix),
      } as IChartData)
  );
}

function prepareAnalyticsData(target: ITargetItem, regg: IReggLine) {
  const startDate = new Date(target.startDate);
  const daysPassed = Math.floor(differenceInDays(new Date(), startDate));

  const detailInfo = [
    { label: "", value: target.name },
    { label: "Initial", value: target.initialValue.toString() },
    { label: "Target", value: target.targetValue.toString() },
    {
      label: "Started At",
      value: format(new Date(target.startDate), "MMM d"),
    },
  ];

  const targetDate = Math.floor((target.targetValue - regg.b) / regg.m);
  if (targetDate > 0) {
    if (daysPassed >= targetDate) {
      detailInfo.push({ label: "Days Passed", value: targetDate.toString() });
      detailInfo.push({ label: "Days Remaining", value: "Finished" });
    } else {
      detailInfo.push({ label: "Days Passed", value: daysPassed.toString() });
      detailInfo.push({
        label: "Days Remaining",
        value: (targetDate - daysPassed).toString(),
      });
    }
  } else {
    detailInfo.push({ label: "Days Passed", value: daysPassed.toString() });
    detailInfo.push({
      label: "Days Remaining",
      value: "Not possible",
    });
  }

  return detailInfo;
}

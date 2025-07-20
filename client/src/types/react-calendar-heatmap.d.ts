declare module "react-calendar-heatmap" {
  import { Component } from "react";

  export interface HeatMapValue {
    date: string | Date;
    count?: number;
  }

  export interface ReactCalendarHeatmapProps {
    startDate: string | Date;
    endDate: string | Date;
    values: HeatMapValue[];
    classForValue?: (value: HeatMapValue) => string;
    titleForValue?: (value: HeatMapValue) => string;
    tooltipDataAttrs?: (value: HeatMapValue) => object;
    showWeekdayLabels?: boolean;
    onClick?: (value: HeatMapValue) => void;
    showMonthLabels?: boolean;
    horizontal?: boolean;
    gutterSize?: number;
    weekdayLabels?: string[];
    monthLabels?: string[];
    transformDayElement?: (
      element: JSX.Element,
      value: HeatMapValue,
      index: number,
    ) => JSX.Element;
  }

  export default class ReactCalendarHeatmap extends Component<ReactCalendarHeatmapProps> {}
}

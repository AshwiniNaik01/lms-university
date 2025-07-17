// pages/line-chart/LineChart.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="Student Registration Growth | Dashboard"
        description="Line chart showing monthly student registration growth."
      />
      {/* <PageBreadcrumb pageTitle="📈 Student Growth Line Chart" /> */}
      <div className="space-y-6">
        <ComponentCard title="Monthly Student Registration Chart">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}

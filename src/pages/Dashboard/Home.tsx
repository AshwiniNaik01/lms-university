// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import PageMeta from "../../components/common/PageMeta";

import { Calendar } from "lucide-react";
import AdminDashboardCards from "../../components/admindashboard/AdminDashboardCards";
// import Calendar from "../Calendar";
import LineChart from "../Charts/LineChart";
import CourseCard from "../CourseCard";



export default function Home() {
  return (
<>
  {/* PageMeta can be uncommented when needed */}
  {/* 
  <PageMeta
    title="React.js Ecommerce Dashboard | TailAdmin"
    description="React.js Ecommerce Dashboard page for TailAdmin"
  /> 
  */}

  <div className="p-2 md:p-2">
    <div className="grid grid-cols-12 gap-6">
      {/* Admin Dashboard Cards - Full Width */}
      <div className="col-span-12">
        <AdminDashboardCards />
      </div>

      {/* Line Chart (2/3) + Course Card (1/3) */}
      <div className="col-span-12 flex flex-col md:flex-row gap-6">
        {/* Line Chart */}
        <div className="w-full md:w-2/3 h-80">
          <div className="h-auto p-4 rounded-xl border bg-white shadow">
            <LineChart />
          </div>
        </div>

        {/* Course Card */}
        <div className="w-full md:w-1/3 h-80">
          <div className="h-auto p-4 rounded-xl border bg-white shadow">
            <CourseCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
}

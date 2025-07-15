import { BrowserRouter as Router, Routes, Route } from "react-router";
// import DashboardPage from "./pages/DashboardPage";
import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";

export default function App() {
  return (
    <>
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
         <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

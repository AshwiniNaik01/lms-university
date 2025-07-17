import { BrowserRouter as Router, Routes, Route } from "react-router";
// import DashboardPage from "./pages/DashboardPage";
import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";

export default function App() {
  return (
    <>
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
          <Route path="/trainer-form" element={<FormElements/>}/>
         <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
             <Route path="/calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

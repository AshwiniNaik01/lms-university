import { Outlet } from "react-router-dom";

const FullScreenLayout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};


export default FullScreenLayout;


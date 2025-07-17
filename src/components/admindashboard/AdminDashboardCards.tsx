import React from "react";
import {
  GraduationCapIcon,
  BookOpenIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"; // or your icon source

type CardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};


const metrics: CardProps[] = [
  {
    icon: <GraduationCapIcon className="text-white size-6" />,
    label: "Students",
    value: "1,257",
  },
  {
    icon: <BookOpenIcon className="text-white size-6" />,
    label: "Courses",
    value: "32",
  },
  {
    icon: <UserCheckIcon className="text-white size-6" />,
    label: "Trainers",
    value: "124",
  },
  {
    icon: <UsersIcon className="text-white size-6" />,
    label: "Batches",
    value: "18",
  },
];

const iconBackgrounds = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-green-500 to-green-700",
  "from-yellow-500 to-yellow-600",
];

const AdminDashboardCards: React.FC = () => {
  return (
    <div className="w-full px-4 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-6 bg-white dark:bg-white/[0.05]
                       border border-gray-200 dark:border-gray-800 rounded-2xl 
                       shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out
                       min-h-[170px] w-full"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl 
                           bg-gradient-to-br ${iconBackgrounds[index]} shadow-md`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-6">
              <span className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-wide font-medium">
                {item.label}
              </span>
              <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {item.value}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardCards;

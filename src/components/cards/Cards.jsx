// import React from "react";
// import { motion } from "framer-motion";

// const Cards = ({ title, description, actionButtons = [], className = "" }) => {
//   return (
//     <motion.div
//       className={`bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 ${className}`}
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 0.97 }}
//     >
//       {/* Content */}
//       <div className="flex-1">
//         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         {description && <p className="text-gray-600 text-sm mt-2">{description}</p>}
//       </div>

//       {/* Buttons at the bottom */}
//       {actionButtons.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-4">
//           {actionButtons.map((button, index) => (
//             <div key={index} className="flex-1">
//               {button}
//             </div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Cards;


import React from "react";
import { motion } from "framer-motion";

const Cards = ({ 
  title, 
  description, 
  actionButtons = [], 
  className = "",
  variant = "default", // default, gradient, glass, minimal, elevated
  icon, // Optional icon component
  badge, // Optional badge text
  image, // Optional image URL
  footer, // Optional footer content
  stats, // Optional stats array: [{label: "Students", value: "150"}]
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-600",
  hoverEffect = true
}) => {
  
  // Variant Styles
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg",
    gradient: `bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`,
    glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
    minimal: "bg-transparent border-2 border-gray-300 shadow-sm",
    elevated: "bg-white border border-gray-100 shadow-2xl"
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: hoverEffect ? {
      scale: 1.03,
      y: -5,
      transition: { duration: 0.2 }
    } : {},
    tap: { scale: 0.98 }
  };

  const isDarkVariant = variant === "gradient" || variant === "glass";

  return (
    <motion.div
      className={`
        rounded-2xl p-6 flex flex-col justify-between 
        transition-all duration-300 relative overflow-hidden
        group cursor-pointer
        ${variants[variant]} ${className}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Background Pattern for some variants */}
      {(variant === "minimal" || variant === "default") && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}

      {/* Optional Badge */}
      {badge && (
        <div className={`
          absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold
          ${isDarkVariant 
            ? 'bg-white/20 text-white backdrop-blur-sm' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          }
        `}>
          {badge}
        </div>
      )}

      {/* Optional Image */}
      {image && (
        <div className="w-16 h-16 rounded-xl mb-4 overflow-hidden shadow-md">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start gap-3 mb-3">
          {icon && (
            <div className={`
              p-2 rounded-lg flex-shrink-0
              ${isDarkVariant 
                ? 'bg-white/20 text-white' 
                : 'bg-blue-50 text-blue-600'
              }
            `}>
              {icon}
            </div>
          )}
          
          <div className="flex-1">
            <h2 className={`
              text-xl font-bold leading-tight
              ${isDarkVariant ? 'text-white' : 'text-gray-800'}
            `}>
              {title}
            </h2>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className={`
            text-sm leading-relaxed mt-2
            ${isDarkVariant ? 'text-white/80' : 'text-gray-600'}
          `}>
            {description}
          </p>
        )}

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`
                  text-lg font-bold
                  ${isDarkVariant ? 'text-white' : 'text-gray-800'}
                `}>
                  {stat.value}
                </div>
                <div className={`
                  text-xs
                  ${isDarkVariant ? 'text-white/70' : 'text-gray-500'}
                `}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {actionButtons.length > 0 && (
        <div className={`
          flex flex-wrap gap-2 mt-4 pt-4 relative z-10
          ${stats || description ? 'border-t border-gray-200/50' : ''}
        `}>
          {actionButtons.map((button, index) => (
            <motion.div 
              key={index}
              className="flex-1 min-w-[120px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {button}
            </motion.div>
          ))}
        </div>
      )}

      {/* Optional Footer */}
      {footer && (
        <div className={`
          mt-4 pt-4 border-t text-xs
          ${isDarkVariant ? 'text-white/60 border-white/20' : 'text-gray-500 border-gray-200'}
        `}>
          {footer}
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 pointer-events-none
        ${variant === 'gradient' 
          ? 'bg-white/5' 
          : variant === 'glass'
          ? 'bg-white/10'
          : 'bg-black/5'
        }
      `} />
    </motion.div>
  );
};

// Example usage with different variants:
export const CardExample = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Default Card */}
      <Cards
        title="Default Card"
        description="This is a standard card with clean design and smooth animations."
        actionButtons={[
          <button key="1" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Action
          </button>
        ]}
      />

      {/* Gradient Card */}
      <Cards
        variant="gradient"
        title="Gradient Card"
        description="Beautiful gradient background with white text."
        badge="New"
        actionButtons={[
          <button key="1" className="w-full bg-white/20 text-white py-2 px-4 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors">
            Get Started
          </button>
        ]}
      />

      {/* Glass Card */}
      <Cards
        variant="glass"
        title="Glass Morphism"
        description="Modern glass effect with backdrop blur."
        stats={[
          { label: "Users", value: "1.2K" },
          { label: "Growth", value: "+24%" }
        ]}
      />

      {/* Card with Icon and Stats */}
      <Cards
        title="Analytics Dashboard"
        description="Monitor your key metrics and performance indicators."
        icon="📊"
        stats={[
          { label: "Visits", value: "2.4K" },
          { label: "Conversion", value: "12%" },
          { label: "Revenue", value: "$4.2K" }
        ]}
        actionButtons={[
          <button key="1" className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
            View Report
          </button>,
          <button key="2" className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            Export
          </button>
        ]}
      />

      {/* Minimal Card */}
      <Cards
        variant="minimal"
        title="Minimal Design"
        description="Clean and simple with subtle borders."
        footer="Last updated 2 hours ago"
      />

      {/* Elevated Card */}
      <Cards
        variant="elevated"
        title="Premium Feature"
        description="Enhanced shadow and border for important content."
        badge="Pro"
        actionButtons={[
          <button key="1" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
            Upgrade Now
          </button>
        ]}
      />
    </div>
  );
};

export default Cards;
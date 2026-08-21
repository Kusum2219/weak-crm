import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "▦",
    },
    {
      name: "Students",
      path: "/students",
      icon: "👥",
    },
    {
      name: "Follow-Ups",
      path: "/followups",
      icon: "↻",
    },
    {
      name: "At Risk",
      path: "/at-risk",
      icon: "⚠",
    },
    {
      name: "Performance",
      path: "/performance",
      icon: "▥",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <div className="flex items-center gap-3">
          
          {/* Logo Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            W
          </div>

          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900">
              Weak Student
            </h1>

            <p className="text-xs font-medium text-blue-600">
              CRM
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-blue-600"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Name */}
                  <span className="flex-1">
                    {item.name}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Info */}
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              CRM
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                Student Management
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Academic CRM
              </p>
            </div>

          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          Weak Student CRM
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
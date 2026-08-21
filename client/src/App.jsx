import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import FollowUp from "./pages/FollowUp";
import Performance from "./pages/Performance";
import AtRisk from "./pages/AtRisk";

const Placeholder = ({ title }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          This page will be built next.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="ml-64 min-h-screen">
          <Routes>
            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Students */}
            <Route
              path="/students"
              element={<Students />}
            />

            {/* Follow Ups */}
            <Route
              path="/followups"
              element={<FollowUp />}
            />

            {/* Performance */}
            <Route
              path="/performance"
              element={<Performance />}
            />

            {/* At Risk */}
            

            {/* Records */}
            <Route
              path="/records"
              element={<Placeholder title="Student Records" />}
            />

            {/* Unknown URL */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

            <Route
  path="/at-risk"
  element={<AtRisk />}
/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
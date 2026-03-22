import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// ── Public ───────────────────────────────────────────────────
import Index              from "./pages/Index";
import Events             from "./pages/Events";
import EventDetail        from "./pages/EventDetail";
import About              from "./pages/About";
import Community          from "./pages/Community";
import BuildersConnectors from "./pages/BuildersConnectors";
import Collaborate        from "./pages/Collaborate";
import NotFound           from "./pages/NotFound";

// ── Legacy (keep — old links may still point here) ────────────

// ── Auth ─────────────────────────────────────────────────────
import Login      from "./pages/auth/Login";
import Register   from "./pages/auth/Register";
import Onboarding from "./pages/Onboarding";
import ResetPassword from "./pages/auth/ResetPassword";

// ── Member ───────────────────────────────────────────────────
import Dashboard      from "./pages/Dashboard";
import Profile        from "./pages/Profile";
import PublicProfile  from "./pages/PublicProfile";
import ApplyRole      from "./pages/ApplyRole";

// ── Apply flows ───────────────────────────────────────────────
// ConnectorApply lives at src/pages/apply/ConnectorApply.tsx
// If you haven't pushed that file yet, comment out both lines below
// and uncomment the placeholder version under it.
import ConnectorApply from "./pages/apply/ConnectorApply";
// import ConnectorApply from "./pages/ApplyRole"; // TEMP: remove once apply/ConnectorApply.tsx is pushed

// ── Organizer portal ─────────────────────────────────────────
import OrganizerApply     from "./pages/organizer/Apply";
import OrganizerStatus    from "./pages/organizer/Status";
import OrganizerDashboard from "./pages/organizer/Dashboard";
// NewEvent lives at src/pages/organizer/NewEvent.tsx
// Comment out if not pushed yet:
import NewEvent           from "./pages/organizer/NewEvent";

// ── Admin ─────────────────────────────────────────────────────
import {
  AdminDashboard,
  AdminApplications,
  AdminApplicationDetail,
} from "./pages/admin/Admin";

// Members.tsx is currently at src/pages/Members.tsx (root level)
// Once you move it to src/pages/admin/Members.tsx, update this import
import AdminMembers from "./pages/Members";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/"                    element={<Index />} />
          <Route path="/events"              element={<Events />} />
          <Route path="/events/:id"          element={<EventDetail />} />
          <Route path="/about"               element={<About />} />
          <Route path="/community"           element={<Community />} />
          <Route path="/builders-connectors" element={<BuildersConnectors />} />
          <Route path="/community-builders"  element={<BuildersConnectors />} />
          <Route path="/collaborate"         element={<Collaborate />} />

          {/* ── Auth ───────────────────────────────────────── */}
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ── Member ─────────────────────────────────────── */}
          <Route path="/dashboard"        element={<Dashboard />} />
          <Route path="/dashboard/rsvps"  element={<Dashboard />} />
          <Route path="/dashboard/saved"  element={<Dashboard />} />
          <Route path="/dashboard/circle" element={<Dashboard />} />
          <Route path="/profile"          element={<Profile />} />
          <Route path="/profile/:id"      element={<PublicProfile />} />
          <Route path="/apply-role"       element={<ApplyRole />} />
          <Route path="/apply/connector"  element={<ConnectorApply />} />
          <Route path="/apply/builder"    element={<OrganizerApply />} />

          {/* ── Organizer portal ───────────────────────────── */}
          <Route path="/organizer/apply"           element={<OrganizerApply />} />
          <Route path="/organizer/status"          element={<OrganizerStatus />} />
          <Route path="/organizer/dashboard"       element={<OrganizerDashboard />} />
          <Route path="/organizer/events/new"      element={<NewEvent />} />
          <Route path="/organizer/events/:id/edit" element={<NewEvent />} />

          {/* ── Admin ──────────────────────────────────────── */}
          <Route path="/admin"                  element={<AdminDashboard />} />
          <Route path="/admin/members"          element={<AdminMembers />} />
          <Route path="/admin/applications"     element={<AdminApplications />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

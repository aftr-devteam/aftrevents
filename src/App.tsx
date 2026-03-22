import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import About from "./pages/About";
import Community from "./pages/Community";
import BuildersConnectors from "./pages/BuildersConnectors";
import Collaborate from "./pages/Collaborate";
import NotFound from "./pages/NotFound";

// Legacy
import Collaborators from "./pages/Collaborators";
import BecomeCollaborator from "./pages/BecomeCollaborator";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";

// Member
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ApplyRole from "./pages/ApplyRole";

// Organizer
import OrganizerApply from "./pages/organizer/Apply";
import OrganizerStatus from "./pages/organizer/Status";
import OrganizerDashboard from "./pages/organizer/Dashboard";
// import OrganizerNewEvent from "./pages/organizer/NewEvent"; // Step 4 — coming next

// Admin
import { AdminDashboard, AdminApplications, AdminApplicationDetail } from "./pages/admin/Admin";
import AdminMembers from "./pages/admin/Members";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/builders-connectors" element={<BuildersConnectors />} />
          <Route path="/community-builders" element={<BuildersConnectors />} />
          <Route path="/collaborate" element={<Collaborate />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="/become-collaborator" element={<BecomeCollaborator />} />

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* ── Member ── */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/apply-role" element={<ApplyRole />} />

          {/* ── Organizer ── */}
          <Route path="/organizer/apply" element={<OrganizerApply />} />
          <Route path="/organizer/status" element={<OrganizerStatus />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          {/* <Route path="/organizer/events/new" element={<OrganizerNewEvent />} /> */}

          {/* ── Admin ── */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

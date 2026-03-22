import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// ── Public pages ─────────────────────────────────────────────
import Index             from "./pages/Index";
import Events            from "./pages/Events";
import EventDetail       from "./pages/EventDetail";
import About             from "./pages/About";
import Community         from "./pages/Community";
import BuildersConnectors from "./pages/BuildersConnectors";
import Collaborate       from "./pages/Collaborate";
import NotFound          from "./pages/NotFound";

// ── Legacy redirects (keep — external links may still exist) ──
import Collaborators      from "./pages/Collaborators";
import BecomeCollaborator from "./pages/BecomeCollaborator";

// ── Auth ─────────────────────────────────────────────────────
import Login      from "./pages/auth/Login";
import Register   from "./pages/auth/Register";
import Onboarding from "./pages/Onboarding";

// ── Member ───────────────────────────────────────────────────
import Dashboard     from "./pages/Dashboard";
import Profile       from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ApplyRole     from "./pages/ApplyRole";
import ConnectorApply from "./pages/apply/ConnectorApply";

// ── Organizer portal ─────────────────────────────────────────
import OrganizerApply     from "./pages/organizer/Apply";     // Builder application
import OrganizerStatus    from "./pages/organizer/Status";    // Application status + payment upload
import OrganizerDashboard from "./pages/organizer/Dashboard"; // Builder event management
import NewEvent           from "./pages/organizer/NewEvent";  // Create/edit event form

// ── Admin ─────────────────────────────────────────────────────
import {
  AdminDashboard,
  AdminApplications,
  AdminApplicationDetail,
} from "./pages/admin/Admin";
import AdminMembers from "./pages/Members"; // currently at src/pages/Members.tsx
// TODO: move Members.tsx to src/pages/admin/Members.tsx
// then change above import to: import AdminMembers from "./pages/admin/Members";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/"                   element={<Index />} />
          <Route path="/events"             element={<Events />} />
          <Route path="/events/:id"         element={<EventDetail />} />
          <Route path="/about"              element={<About />} />
          <Route path="/community"          element={<Community />} />
          <Route path="/builders-connectors" element={<BuildersConnectors />} />
          <Route path="/community-builders"  element={<BuildersConnectors />} /> {/* legacy URL */}
          <Route path="/collaborate"        element={<Collaborate />} />

          {/* Legacy */}
          <Route path="/collaborators"       element={<Collaborators />} />
          <Route path="/become-collaborator" element={<BecomeCollaborator />} />

          {/* ── Auth ───────────────────────────────────────── */}
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/onboarding"  element={<Onboarding />} />

          {/* ── Member ─────────────────────────────────────── */}
          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/dashboard/rsvps"   element={<Dashboard />} /> {/* sub-tabs handled inside */}
          <Route path="/dashboard/saved"   element={<Dashboard />} />
          <Route path="/dashboard/circle"  element={<Dashboard />} />
          <Route path="/profile"           element={<Profile />} />
          <Route path="/profile/:id"       element={<PublicProfile />} />
          <Route path="/apply-role"        element={<ApplyRole />} />
          <Route path="/apply/connector"   element={<ConnectorApply />} />
          <Route path="/apply/builder"     element={<OrganizerApply />} /> {/* reuses existing builder apply */}

          {/* ── Organizer portal ───────────────────────────── */}
          <Route path="/organizer/apply"          element={<OrganizerApply />} />
          <Route path="/organizer/status"         element={<OrganizerStatus />} />
          <Route path="/organizer/dashboard"      element={<OrganizerDashboard />} />
          <Route path="/organizer/events/new"     element={<NewEvent />} />
          <Route path="/organizer/events/:id/edit" element={<NewEvent />} /> {/* same form, edit mode */}

          {/* ── Admin ──────────────────────────────────────── */}
          <Route path="/admin"                        element={<AdminDashboard />} />
          <Route path="/admin/members"                element={<AdminMembers />} />
          <Route path="/admin/applications"           element={<AdminApplications />} />
          <Route path="/admin/applications/:id"       element={<AdminApplicationDetail />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

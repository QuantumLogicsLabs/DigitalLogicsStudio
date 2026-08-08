import { Navigate, useParams } from "react-router-dom";
import TheoryHomePage from "./TheoryHomePage";
import { TRACKS } from "./tracks";

// Registered at "/resources/:track?" (preserving the legacy param-based
// route) so "/resources", "/resources/dld" both render the DLD home
// page, "/resources/coal" redirects to its own static route, and any
// other value falls back to "/resources/dld".
export default function DldHomeRoute() {
  const { track } = useParams();

  if (track === "coal") return <Navigate to="/resources/coal" replace />;
  if (track && track !== "dld") return <Navigate to="/resources/dld" replace />;

  return <TheoryHomePage track={TRACKS.dld} />;
}

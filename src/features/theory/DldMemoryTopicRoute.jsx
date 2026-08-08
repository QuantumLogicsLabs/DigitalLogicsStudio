import TheoryTopicPage from "./TheoryTopicPage";
import { TRACKS } from "./tracks";

// Memory Systems is the first DLD part fully migrated onto the shared,
// data-driven theory renderer (see data/dldTopicContent.js). Registered
// at each of the 7 existing "/memory/*" routes in App.js — same URLs,
// now backed by data instead of hand-written page components.
export default function DldMemoryTopicRoute() {
  return <TheoryTopicPage track={TRACKS.dld} />;
}

import { trackWebVital } from "./utils/analytics";

const reportWebVitals = (onPerfEntry) => {
  const reporter =
    onPerfEntry ||
    ((metric) => {
      trackWebVital(metric);
    });

  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
        getCLS(reporter);
        if (typeof getINP === "function") {
          getINP(reporter);
        } else {
          getFID(reporter);
        }
        getFCP(reporter);
        getLCP(reporter);
        getTTFB(reporter);
      },
    );
  } else {
    import("web-vitals").then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
        getCLS(reporter);
        if (typeof getINP === "function") {
          getINP(reporter);
        } else {
          getFID(reporter);
        }
        getFCP(reporter);
        getLCP(reporter);
        getTTFB(reporter);
      },
    );
  }
};

export default reportWebVitals;

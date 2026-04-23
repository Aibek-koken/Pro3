import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { NavBar } from "./components/NavBar";

const HealthShield = lazy(async () => {
  const module = await import("./pages/HealthShield");
  return { default: module.HealthShield };
});

const PandemicRadar = lazy(async () => {
  const module = await import("./pages/PandemicRadar");
  return { default: module.PandemicRadar };
});

function AppShellFallback() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-12 w-56" />
      <LoadingSkeleton className="h-64 w-full" />
      <LoadingSkeleton className="h-80 w-full" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<AppShellFallback />}>
          <Routes>
            <Route path="/" element={<HealthShield />} />
            <Route path="/radar" element={<PandemicRadar />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

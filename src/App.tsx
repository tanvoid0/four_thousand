import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProfileProvider } from "./shared/ProfileContext";
import Layout from "./shared/Layout";
import Home from "./pages/Home";
import { liveModules } from "./modules/registry";

function Loading() {
  return <div className="py-24 text-center text-[var(--muted)]">Loading…</div>;
}

export default function App() {
  return (
    <ProfileProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            {liveModules().map((m) => {
              const Page = lazy(m.load!);
              return (
                <Route
                  key={m.id}
                  path={m.path}
                  element={
                    <Suspense fallback={<Loading />}>
                      <Page />
                    </Suspense>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProfileProvider>
  );
}

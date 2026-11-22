import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Nav from "./components/Nav";
import News from "./components/News";
import Footer from "./components/Footer";
import { CATEGORIES } from "./config";

const App = () => {
  const [progress, setProgress] = useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      {/* colour comes from --color-loading in index.css, so it follows light/dark mode */}
      <LoadingBar color="var(--color-loading)" progress={progress} height={3} shadow={false} />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/general" replace />} />
          {CATEGORIES.map(({ slug, label }) => (
            <Route
              key={slug}
              path={`/${slug}`}
              element={
                <News
                  key={slug}
                  category={slug}
                  label={label}
                  setProgress={setProgress}
                />
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/general" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

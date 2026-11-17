import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

// the server renderer never runs error boundaries, so a subclass that starts out failed stands in for a crash
class Crashed extends ErrorBoundary {
  state = { failed: true };
}

afterEach(() => vi.unstubAllGlobals());

/** render the fallback over a localStorage holding `raw`; any write to it throws, failing the test */
function fallback(raw: string | null): string {
  const boom = () => {
    throw new Error("the fallback must never write localStorage");
  };
  vi.stubGlobal("localStorage", { getItem: () => raw, setItem: boom, removeItem: boom, clear: boom });
  return renderToStaticMarkup(<Crashed>page</Crashed>);
}

describe("ErrorBoundary", () => {
  it("renders its children until something throws", () => {
    expect(renderToStaticMarkup(<ErrorBoundary>page</ErrorBoundary>)).toBe("page");
  });

  it("fallback offers Reload and a download of what is saved", () => {
    const html = fallback('{"birthDate":"1990-05-15"}');
    expect(html).toContain("Reload");
    expect(html).toContain("Download my data");
    expect(html).not.toMatch(/\sdisabled=""/);
  });

  it("says so, instead of offering an empty download, when nothing is saved", () => {
    const html = fallback(null);
    expect(html).toContain("Nothing is saved");
    expect(html).toMatch(/\sdisabled=""/);
  });
});

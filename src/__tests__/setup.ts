import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Polyfill for matchMedia (required by Ant Design components)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill jsdom's missing pseudo-element support for getComputedStyle
const origGetComputedStyle = window.getComputedStyle;
(window as any).getComputedStyle = function (
  elt: Element,
  pseudoElt?: string | null
) {
  // If a pseudo-element is requested, return a minimal object that rc-util expects.
  if (pseudoElt) {
    return {
      // rc-util calls getPropertyValue('width') etc.; return empty string by default
      getPropertyValue: () => "",
    } as any;
  }
  // Otherwise fall back to the original implementation
  return origGetComputedStyle
    ? origGetComputedStyle.call(window, elt)
    : ({} as any);
};

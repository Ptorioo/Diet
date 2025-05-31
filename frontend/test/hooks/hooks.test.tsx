import * as React from "react";
import { render, act } from "@testing-library/react";
import { useIsMobile } from "../../src/hooks/use-mobile";
import { useToast, toast as toastFn } from "../../src/hooks/use-toast";

// Polyfill window.matchMedia for JSDOM
beforeAll(() => {
    if (!window.matchMedia) {
        window.matchMedia = function (query: string) {
            return {
                matches: window.innerWidth < 768,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            } as any;
        };
    }
});

function setScreenWidth(width: number) {
    (window as any).innerWidth = width;
    (window as any).dispatchEvent(new Event("resize"));
}

describe("useIsMobile", () => {
    function TestComponent() {
        const isMobile = useIsMobile();
        return <div data-testid="is-mobile">{isMobile ? "mobile" : "desktop"}</div>;
    }

    it("returns true when width is less than 768", () => {
        setScreenWidth(500);
        const { getByTestId } = render(<TestComponent />);
        expect(getByTestId("is-mobile").textContent).toBe("mobile");
    });

    it("returns false when width is 768 or more", () => {
        setScreenWidth(900);
        const { getByTestId } = render(<TestComponent />);
        expect(getByTestId("is-mobile").textContent).toBe("desktop");
    });
});

describe("useToast", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    function TestToastComponent() {
        const { toasts, toast, dismiss } = useToast();
        return (
            <div>
                <button
                    data-testid="add-toast"
                    onClick={() => toast({ title: "Hello", description: "World" })}
                >
                    Add Toast
                </button>
                <button
                    data-testid="dismiss-toast"
                    onClick={() => toasts[0] && dismiss(toasts[0].id)}
                >
                    Dismiss Toast
                </button>
                <div data-testid="toast-count">{toasts.length}</div>
                {toasts.map((t) => (
                    <div key={t.id} data-testid="toast-title">
                        {t.title}
                    </div>
                ))}
            </div>
        );
    }

    it("adds a toast", () => {
        const { getByTestId, queryAllByTestId } = render(<TestToastComponent />);
        act(() => {
            getByTestId("add-toast").click();
        });
        expect(getByTestId("toast-count").textContent).toBe("1");
        expect(queryAllByTestId("toast-title")[0].textContent).toBe("Hello");
    });

    it("dismisses a toast", () => {
        const { getByTestId } = render(<TestToastComponent />);
        act(() => {
            getByTestId("add-toast").click();
        });
        expect(getByTestId("toast-count").textContent).toBe("1");
        act(() => {
            getByTestId("dismiss-toast").click();
        });
        // Toast is still present until timer runs
        expect(getByTestId("toast-count").textContent).toBe("1");
        act(() => {
            jest.runOnlyPendingTimers();
        });
        // After timer, toast should be removed
        expect(getByTestId("toast-count").textContent).toBe("0");
    });

    it("toast function returns dismiss and update", () => {
        const t = toastFn({ title: "Toast" });
        expect(typeof t.dismiss).toBe("function");
        expect(typeof t.update).toBe("function");
        act(() => {
            t.dismiss();
            jest.runOnlyPendingTimers();
        });
    });
});
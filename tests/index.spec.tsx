import React from "react";
import { render } from "react-testing-library";
import PageTransition from "../src";

describe("PageTransition", () => {
    test("render", () => {
        const wrapper = render(
            <PageTransition>
                <p>blockA</p>
            </PageTransition>
        );
        const p = wrapper.getByText("blockA");
        expect(p.parentElement.classList.contains("transition-wrapper")).toBeTruthy();
        expect(p.parentElement.classList.contains("transition-mode-both")).toBeTruthy();
    });
});

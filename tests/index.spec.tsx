import React from "react";
import { render } from "react-testing-library";
import PageTransition from "../src";

// 由于内部调用得 Promise 导致无法进行测试

describe("PageTransition", () => {
    test("both render", () => {
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

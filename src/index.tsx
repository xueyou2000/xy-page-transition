import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { PageTransitionProps, PageTransitionState } from "./interface";

function loop() {}

function PageTransition(props: PageTransitionProps) {
    const { timeout = 300, inTimeout, outTimeout, transitionAction, children, mode = "both" } = props;
    const customizeStateName = transitionAction ? transitionAction.toLocaleLowerCase() : transitionAction;
    const [childs, setChilds] = useState<PageTransitionState>({ child1: children, child2: null, current: 1 });
    const name = transitionAction || "transition";
    const [appear, appearActive, leave, leaveActive] = [`${name}-appear`, `${name}-appear-active`, `${name}-leave`, `${name}-leave-active`];
    const child1Ref = useRef(null);
    const child2Ref = useRef(null);
    const appearTimeHandle = useRef(null);
    const leaveTimeHandle = useRef(null);
    const transition = useRef(false);
    const countRef = useRef(1);

    function reset(count: number) {
        const prev = childs.current === 2 ? 1 : 2;
        if (childs[`child${childs.current}`] !== children || count !== countRef.current) {
            return;
        }
        const state: any = {
            [`child${prev}`]: null,
            [`child${childs.current}`]: children,
            current: childs.current,
            stage: null
        };
        transition.current = false;
        setChilds(state);
    }

    function getChild(current: 1 | 2) {
        if (current === 1) {
            return child1Ref && child1Ref.current;
        } else {
            return child2Ref && child2Ref.current;
        }
    }

    /**
     * 新页面进入过渡
     */
    function newAppearStart() {
        const newChild = getChild(childs.current);
        if (!newChild) {
            return;
        }

        newChild.style.display = "block";
        // 离开动画还没结束就立刻移除结束样式
        if (newChild.classList.contains(leaveActive)) {
            newChild.classList.remove(leaveActive, leave, `${name}-leave-complete`);
        }
        newChild.classList.add(appear);

        requestAnimationFrame(() => {
            newChild.classList.add(appearActive);
        });
    }

    /**
     * 新页面进入过渡完毕
     */
    function newAppearEnd() {
        return new Promise((resolve, reject) => {
            const newChild = getChild(childs.current);
            if (!newChild) {
                reject();
                return;
            }

            appearTimeHandle.current = window.setTimeout(() => {
                newAppearComplete();
                resolve();
            }, inTimeout || timeout);
        });
    }

    /**
     * 老页面离开过渡
     */
    function oldLeaveStart() {
        const oldChild = getChild(childs.current === 2 ? 1 : 2);
        if (!oldChild) {
            return;
        }

        oldChild.style.display = null;
        // 进入动画还没结束就立刻移除结束样式
        if (oldChild.classList.contains(appearActive)) {
            oldChild.classList.remove(appearActive, appear, `${name}-appear-complete`);
        }
        oldChild.classList.add(leave);
        requestAnimationFrame(() => {
            oldChild.classList.add(leaveActive);
        });
    }

    /**
     * 老页面离开过渡完毕
     */
    function oldLeaveEnd() {
        return new Promise((resolve, reject) => {
            const oldChild = getChild(childs.current === 2 ? 1 : 2);
            if (!oldChild) {
                reject();
                return;
            }
            leaveTimeHandle.current = window.setTimeout(() => {
                oldLeaveComplete();
                resolve();
            }, outTimeout || timeout);
        });
    }

    function newAppearComplete() {
        const newChild = getChild(childs.current);
        if (!newChild) {
            return;
        }

        newChild.style.display = null;
        newChild.classList.remove(appear, appearActive, `${name}-leave-complete`);
        newChild.classList.add(`${name}-appear-complete`);
        window.clearTimeout(appearTimeHandle.current);
    }

    function oldLeaveComplete() {
        const oldChild = getChild(childs.current === 2 ? 1 : 2);
        if (!oldChild) {
            return;
        }
        oldChild.style.display = "none";
        oldChild.classList.remove(leave, leaveActive, `${name}-appear-complete`);
        oldChild.classList.add(`${name}-leave-complete`);
        window.clearTimeout(leaveTimeHandle.current);
    }

    useEffect(() => {
        if (children === childs[`child${childs.current}`]) {
            return;
        }
        if (transition.current) {
            // 上一个过渡还没完毕，则立即设置为完毕状态
            oldLeaveComplete();
            newAppearComplete();
        }

        transition.current = true;
        countRef.current = countRef.current + (1 % 50);
        // 新页面开始进入
        if (childs.current === 1) {
            setChilds({ child1: childs.child1, child2: children, current: 2 });
        } else {
            setChilds({ child1: children, child2: childs.child2, current: 1 });
        }
    }, [children]);

    if (transition.current) {
        const count = countRef.current;
        window.clearTimeout(appearTimeHandle.current);
        window.clearTimeout(leaveTimeHandle.current);
        switch (mode) {
            case "in-out":
                Promise.resolve()
                    .then(newAppearStart)
                    .then(newAppearEnd)
                    .then(oldLeaveStart)
                    .then(oldLeaveEnd)
                    .then(() => reset(count))
                    .catch(loop);
                break;
            case "out-in":
                Promise.resolve()
                    .then(oldLeaveStart)
                    .then(oldLeaveEnd)
                    .then(newAppearStart)
                    .then(newAppearEnd)
                    .then(() => reset(count))
                    .catch(loop);
                break;
            default:
                Promise.resolve()
                    .then(() => {
                        newAppearStart();
                        oldLeaveStart();
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            oldLeaveEnd().catch(reject);
                            newAppearEnd().catch(reject);
                            setTimeout(() => {
                                window.clearTimeout(appearTimeHandle.current);
                                window.clearTimeout(leaveTimeHandle.current);
                                resolve();
                            }, timeout);
                        });
                    })
                    .then(() => reset(count))
                    .catch(loop);
        }
    }

    return (
        <div className={classNames("transition-wrapper", `transition-mode-${mode}`, { [`transition-action-${customizeStateName}`]: customizeStateName })}>
            {childs.child1 && React.Children.map(childs.child1, (node) => React.cloneElement(node as any, { ref: child1Ref }))}
            {childs.child2 && React.Children.map(childs.child2, (node) => React.cloneElement(node as any, { ref: child2Ref }))}
        </div>
    );
}

export default React.memo(PageTransition);

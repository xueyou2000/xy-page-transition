import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { PageTransitionProps, PageTransitionState, PageTransitionContextState, PageTransitionEvents } from "./interface";
import { PageTransitionContext } from "./context";
import ReactDOM from "react-dom";

function loop() {}

function PageTransition(props: PageTransitionProps) {
    const { timeout = 300, inTimeout, outTimeout, delayTimeout, transitionAction, children, mode = "both", data, disabled = false } = props;
    const customizeStateName = transitionAction ? transitionAction.toLocaleLowerCase() : transitionAction;
    const [childs, setChilds] = useState<PageTransitionState>({ child1: children, child2: null, current: 1 });
    const name = transitionAction || "transition";
    const [appear, appearActive, leave, leaveActive, delayReady] = [`${name}-appear`, `${name}-appear-active`, `${name}-leave`, `${name}-leave-active`, `${name}-delay-ready`];
    const child1Ref = useRef(null);
    const child2Ref = useRef(null);
    const appearTimeHandle = useRef(null);
    const leaveTimeHandle = useRef(null);
    const delayTimeHandle = useRef(null);
    const transition = useRef(false);
    const countRef = useRef(1);

    const child1Context = useRef<PageTransitionEvents>({});
    const child2Context = useRef<PageTransitionEvents>({});

    function reset(count: number) {
        const prev = childs.current === 2 ? 1 : 2;
        if (childs[`child${childs.current}`] !== children || count !== countRef.current) {
            return;
        }
        const state: any = {
            [`child${prev}`]: null,
            [`child${childs.current}`]: children,
            current: childs.current,
            stage: null,
        };
        transition.current = false;
        setChilds(state);
    }

    function getChild(current: 1 | 2) {
        if (current === 1) {
            return ReactDOM.findDOMNode(child1Ref.current) as HTMLElement;
        } else {
            return ReactDOM.findDOMNode(child2Ref.current) as HTMLElement;
        }
    }

    function getChildContext(current: 1 | 2) {
        if (current === 1) {
            return child1Context.current;
        } else {
            return child2Context.current;
        }
    }

    function getContext(current: 1 | 2): PageTransitionContextState {
        const context = current === 1 ? child1Context.current : child2Context.current;

        return {
            onAppearEnd: (cb) => {
                context.onAppearEnd = cb;
            },
            onAppearWillStart: (cb) => {
                context.onAppearWillStart = cb;
            },
            onLeaveEnd: (cb) => {
                context.onLeaveEnd = cb;
            },
            onLeaveWillStart: (cb) => {
                context.onLeaveWillStart = cb;
            },
            onAppearing: (cb) => {
                context.onAppearing = cb;
            },
            onLeaveing: (cb) => {
                context.onLeaveing = cb;
            },
        };
    }

    /**
     * 新页面进入过渡
     */
    function newAppearStart() {
        const prev = childs.current === 2 ? 1 : 2;
        const oldChild = getChild(prev);
        const newChild = getChild(childs.current);
        if (!newChild) {
            return;
        }

        const context = getChildContext(childs.current);
        if (context.onAppearWillStart) {
            context.onAppearWillStart(newChild, oldChild, data);
        }

        newChild.style.display = null;
        newChild.classList.remove(delayReady);
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
            const prev = childs.current === 2 ? 1 : 2;
            const oldChild = getChild(prev);
            if (!newChild) {
                reject();
                return;
            }

            const context = getChildContext(childs.current);
            if (context.onAppearing) {
                context.onAppearing(newChild, oldChild, data);
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
        const prev = childs.current === 2 ? 1 : 2;
        const oldChild = getChild(prev);
        const newChild = getChild(childs.current);
        if (!oldChild) {
            return;
        }

        const context = getChildContext(prev);
        if (context.onLeaveWillStart) {
            context.onLeaveWillStart(newChild, oldChild, data);
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
            const newChild = getChild(childs.current);
            const oldChild = getChild(childs.current === 2 ? 1 : 2);
            if (!oldChild) {
                reject();
                return;
            }

            const context = getChildContext(childs.current === 2 ? 1 : 2);
            if (context.onLeaveing) {
                context.onLeaveing(newChild, oldChild, data);
            }

            leaveTimeHandle.current = window.setTimeout(() => {
                oldLeaveComplete();
                resolve();
            }, outTimeout || timeout);
        });
    }

    /**
     * 新元素进入延迟准备
     */
    function newDelayReady() {
        const newChild = getChild(childs.current);
        if (!newChild) {
            return;
        }

        newChild.style.display = null;
        newChild.classList.add(delayReady);
    }

    function newAppearComplete() {
        const prev = childs.current === 2 ? 1 : 2;
        const oldChild = getChild(prev);
        const newChild = getChild(childs.current);
        if (!newChild) {
            return;
        }

        newChild.style.display = null;
        newChild.classList.remove(appear, appearActive, `${name}-leave-complete`, delayReady);
        newChild.classList.add(`${name}-appear-complete`);
        window.clearTimeout(appearTimeHandle.current);

        const context = getChildContext(childs.current);
        if (context.onAppearEnd) {
            context.onAppearEnd(newChild, oldChild, data);
        }
    }

    function oldLeaveComplete() {
        const newChild = getChild(childs.current);
        const prev = childs.current === 2 ? 1 : 2;
        const oldChild = getChild(prev);
        if (!oldChild) {
            return;
        }
        oldChild.style.display = "none";
        oldChild.classList.remove(leave, leaveActive, `${name}-appear-complete`);
        oldChild.classList.add(`${name}-leave-complete`);
        window.clearTimeout(leaveTimeHandle.current);
        window.clearTimeout(delayTimeHandle.current);

        const context = getChildContext(prev);
        if (context.onLeaveEnd) {
            context.onLeaveEnd(newChild, oldChild, data);
        }
    }

    useEffect(() => {
        if (children === childs[`child${childs.current}`]) {
            return;
        }
        if (disabled) {
            if (childs.current === 1) {
                setChilds({ child1: children, child2: null, current: 1 });
            } else {
                setChilds({ child1: null, child2: children, current: 2 });
            }
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
        window.clearTimeout(delayTimeHandle.current);
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
            case "delay":
                Promise.resolve()
                    .then(newDelayReady)
                    .then(oldLeaveStart)
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            oldLeaveEnd();
                            delayTimeHandle.current = setTimeout(() => {
                                resolve();
                            }, delayTimeout || timeout);
                        });
                    })
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
            <PageTransitionContext.Provider value={getContext(1)}>{childs.child1 && React.Children.map(childs.child1, (node) => React.cloneElement(node as any, { ref: child1Ref }))}</PageTransitionContext.Provider>
            <PageTransitionContext.Provider value={getContext(2)}>{childs.child2 && React.Children.map(childs.child2, (node) => React.cloneElement(node as any, { ref: child2Ref }))}</PageTransitionContext.Provider>
        </div>
    );
}

export default React.memo(PageTransition);

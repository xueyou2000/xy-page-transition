import React, { useEffect, useState } from "react";
import classNames from "classnames";
import CSSTransition from "xy-css-transition";
import { PageTransitionProps, PageTransitionState } from "./interface";

function PageTransition(props: PageTransitionProps) {
    const { timeout, transitionAction, children, mode = "both" } = props;
    const customizeStateName = transitionAction ? transitionAction.toLocaleLowerCase() : transitionAction;
    const [childs, setChilds] = useState<PageTransitionState>({ child1: children, child2: null, current: 1 });

    function onAppearComplete() {
        const prev = childs.current === 2 ? 1 : 2;
        const state: any = {
            [`child${prev}`]: null,
            [`child${childs.current}`]: children,
            current: childs.current
        };
        setChilds(state);
    }

    useEffect(() => {
        if (children === childs[`child${childs.current}`]) {
            return;
        }
        if (childs.current === 1) {
            setChilds({ child1: childs.child1, child2: children, current: 2 });
        } else {
            setChilds({ child1: children, child2: childs.child2, current: 1 });
        }
    }, [children]);

    // mode === 'in-out' && childs.current === 1 && 'child2进入完毕';

    return (
        <div className={classNames("transition-wrapper", { [`transition-action-${customizeStateName}`]: customizeStateName })}>
            {childs.child1 &&
                React.Children.map(childs.child1, (node) => (
                    <CSSTransition timeout={timeout} animateOnInit={true} visible={childs.current === 1} onAppearComplete={onAppearComplete}>
                        {node}
                    </CSSTransition>
                ))}
            {childs.child2 &&
                React.Children.map(childs.child2, (node) => (
                    <CSSTransition timeout={timeout} animateOnInit={true} visible={childs.current === 2} onAppearComplete={onAppearComplete}>
                        {node}
                    </CSSTransition>
                ))}
        </div>
    );
}

export default React.memo(PageTransition);

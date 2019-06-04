/**
 * 页面操作
 * @description PUSH=前进, POP=后退, REPLACE=替换
 * Type definitions for history 4.7.2
 * Project: https://github.com/mjackson/history
 */
export type Action = "PUSH" | "POP" | "REPLACE";

export interface PageTransitionProps {
    /**
     * 过渡时间
     * @description 再复杂css时, 同时有很多动画和过渡样式, 所以需要手动指定
     */
    timeout: number;
    /**
     * 页面过渡操作
     * @description 指定是前进还是后退, using history.action from History API
     */
    transitionAction?: Action;
    /**
     * 页面内容
     */
    children?: React.ReactNode;
    /**
     * 过渡模式
     * @description in-out=新元素先进行过渡，完成之后当前元素过渡离开
     * out-in=当前元素先进行过渡，完成之后新元素过渡进入
     * both=二者同时过渡
     */
    mode?: "in-out" | "out-in" | "both";
}

export interface PageTransitionState {
    /**
     * 页面A
     */
    child1: React.ReactNode;
    /**
     * 页面B
     */
    child2?: React.ReactNode;
    /**
     * 当前页面 A或B
     */
    current?: 1 | 2;
}

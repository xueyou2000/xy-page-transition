/**
 * 页面操作
 * @description PUSH=前进, POP=后退, REPLACE=替换
 * Type definitions for history 4.7.2
 * Project: https://github.com/mjackson/history
 */
export type Action = "PUSH" | "POP" | "REPLACE";

export type PageEventCallback = (appear: HTMLElement, leave: HTMLElement, data?: any) => void;

export interface PageTransitionProps {
    /**
     * 是否禁用过渡
     */
    disabled?: boolean;
    /**
     * 过渡时间
     */
    timeout?: number;
    /**
     * 进入元素过渡时间
     * @description 如果不提供，则以timeout为准
     */
    inTimeout?: number;
    /**
     * 离开元素过渡时间
     * @description 如果不提供，则以timeout为准
     */
    outTimeout?: number;
    /**
     * 延迟进入元素时间
     * @description 如果不提供，则以timeout为准
     */
    delayTimeout?: number;
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
     * @description in-out 新元素先进行过渡，完成之后当前元素过渡离开
     * out-in 当前元素先进行过渡，完成之后新元素过渡进入
     * both 二者同时过渡
     * delay 延迟模式, 当前元素先进行过渡离开，延迟一段时间(delayTimeout)后, 新元素过渡进入
     */
    mode?: "in-out" | "out-in" | "both" | "delay";
    /**
     * 传递给页面事件的附加参数
     */
    data?: any;
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

export interface PageTransitionEvents {
    /**
     * 进入过渡即将开始
     */
    onAppearWillStart?: PageEventCallback;
    /**
     * 离开过渡即将开始
     */
    onLeaveWillStart?: PageEventCallback;
    /**
     * 进入过渡结束
     */
    onAppearEnd?: PageEventCallback;
    /**
     * 离开过渡结束
     */
    onLeaveEnd?: PageEventCallback;
    /**
     * 进入过渡进行中
     */
    onAppearing?: PageEventCallback;
    /**
     * 离开过渡进行中
     */
    onLeaveing?: PageEventCallback;
}

export interface PageTransitionContextState {
    /**
     * 进入过渡即将开始
     */
    onAppearWillStart?: (cb: PageEventCallback) => void;
    /**
     * 离开过渡即将开始
     */
    onLeaveWillStart?: (cb: PageEventCallback) => void;
    /**
     * 进入过渡结束
     */
    onAppearEnd?: (cb: PageEventCallback) => void;
    /**
     * 离开过渡结束
     */
    onLeaveEnd?: (cb: PageEventCallback) => void;
    /**
     * 进入过渡进行中
     */
    onAppearing?: (cb: PageEventCallback) => void;
    /**
     * 离开过渡进行中
     */
    onLeaveing?: (cb: PageEventCallback) => void;
}

import React, { useState, useContext } from "react";
import { PageTransition, PageTransitionContext } from "../src";
import "./page.scss";
import randomColor from "randomcolor";

interface ItemState {
    id: number;
    text: string;
    color: string;
}

interface DataState {
    position: ClientRect;
    item: ItemState;
}

function Item(props: { color: string; text: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: props.color }} className="list-item">
            {props.text}
        </div>
    );
}

const items: ItemState[] = [];
for (let i = 0; i < 6; ++i) {
    items.push({
        id: i,
        text: `Item ${i}`,
        color: randomColor()
    });
}

const ListPage = React.forwardRef((props: { onChange: ({ position, item }: DataState) => void }, ref: React.MutableRefObject<any>) => {
    function handle(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: ItemState) {
        const ele = e.target as HTMLElement;
        const rect = ele.getBoundingClientRect();
        props.onChange({ position: { width: rect.width, height: rect.height, left: ele.offsetLeft, top: ele.offsetTop, bottom: 0, right: 0 }, item });
    }

    return (
        <div className="list-page" ref={ref}>
            <p>List Page</p>
            {items.map((item) => (
                <a onClick={(e) => handle(e, item)}>
                    <Item {...item} />
                </a>
            ))}
        </div>
    );
});

const ItemDetailPage = React.forwardRef((props: { data: DataState; onBack: () => void }, ref: React.MutableRefObject<any>) => {
    const { data } = props;
    const pageEvent = useContext(PageTransitionContext);
    const [state, setState] = useState({ position: null, doTransform: false });

    pageEvent.onAppearWillStart((appear, leave) => {
        const { position } = data;
        setState({
            doTransform: true,
            position: { width: `${position.width}px`, height: `${position.height}px`, left: `${position.left}px`, top: `${position.top}px` }
        });

        // appear.style.width = `${position.width}px`;
        // appear.style.height = `${position.height}px`;
        // appear.style.left = `${position.left}px`;
        // appear.style.top = `${position.top}px`;
    });

    pageEvent.onAppearing((appear, leave) => {
        requestAnimationFrame(() => {
            setState({
                doTransform: true,
                position: { width: `100%`, height: `100%`, left: `0px`, top: `0px` }
            });

            // appear.style.width = `100%`;
            // appear.style.height = `100%`;
            // appear.style.left = `0px`;
            // appear.style.top = `0px`;
        });
    });

    pageEvent.onAppearEnd((appear, leave) => {
        setState({
            doTransform: false,
            position: null
        });

        // appear.style.width = null;
        // appear.style.height = null;
        // appear.style.left = null;
        // appear.style.top = null;
    });

    pageEvent.onLeaveWillStart((appear, leave) => {
        setState({
            doTransform: true,
            position: { width: `100%`, height: `100%`, left: `0px`, top: `0px` }
        });

        // leave.style.width = `100%`;
        // leave.style.height = `100%`;
        // leave.style.left = `0px`;
        // leave.style.top = `0px`;
    });

    pageEvent.onLeaveing((appear, leave) => {
        const { position } = data;
        requestAnimationFrame(() => {
            setState({
                doTransform: true,
                position: { width: `${position.width}px`, height: `${position.height}px`, left: `${position.left}px`, top: `${position.top}px` }
            });

            // leave.style.width = `${position.width}px`;
            // leave.style.height = `${position.height}px`;
            // leave.style.left = `${position.left}px`;
            // leave.style.top = `${position.top}px`;
        });
    });

    const style: React.CSSProperties = {
        width: state.doTransform ? state.position.width : null,
        height: state.doTransform ? state.position.height : null,
        left: state.doTransform ? state.position.left : null,
        top: state.doTransform ? state.position.top : null,
        background: data && data.item.color
    };

    return (
        <div className="detail-page" ref={ref} style={style}>
            <a onClick={props.onBack}>Back</a>
            <h1>Detail {data && data.item.text}</h1>
        </div>
    );
});

export default function() {
    const [showDetail, setShowDetail] = useState(false);
    const [data, setData] = useState<DataState>(null);

    return (
        <div>
            <PageTransition timeout={700} mode="both">
                {showDetail ? (
                    <ItemDetailPage data={data} onBack={() => setShowDetail(false)} />
                ) : (
                    <ListPage
                        onChange={(d) => {
                            setData(d);
                            setShowDetail(true);
                        }}
                    />
                )}
            </PageTransition>
        </div>
    );
}

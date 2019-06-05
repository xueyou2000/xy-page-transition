import React, { useState } from "react";
import { PageTransition } from "../src";
import "./index.scss";

export default function() {
    const [page, setPage] = useState(true);

    return (
        <div>
            <button onClick={() => setPage(!page)}>切换页面</button>
            <br />
            <p>{page ? "Home" : "About"}</p>
            <PageTransition timeout={1000} mode="both" delayTimeout={300}>
                {page ? <div className="home">Home</div> : <div className="about">About</div>}
            </PageTransition>
        </div>
    );
}

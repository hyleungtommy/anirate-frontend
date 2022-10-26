import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Anime from "./html/anime";
import { createContext, useState } from "react";
import { browserHistory } from 'react-router';

export default function Routers(){
    const animePage = <Anime/>

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={animePage} ></Route>
            </Routes>
        </BrowserRouter>
    );
}
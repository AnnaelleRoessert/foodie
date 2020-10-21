import React, { useState, useEffect } from "react";
import axios from "../axios";
import Nutrition from "./nutrition";
export default function Community() {
    useEffect(() => {
        console.log("Community has mounted");
    }, []);
    return <Nutrition />;
}

"use client"
import {useEffect, useState} from "react";

export default function Home() {


    const [message, setMessage] = useState("Loading...")

    useEffect(() => {
        fetch("http://localhost:8080/api/home").then(
            response => response.json()
        ).then(
            (data) => {
                setMessage(data.message)
                console.log("useEff")
            }
        )
    }, []);


    return (
        <div>
            {
                message
            }

        </div>
    )
}

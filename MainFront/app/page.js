"use client"
import Layout from "@/components/_home/layout";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import Loader from "@/components/Loader";

export default function Home() {

    const {isLoading} = useContext(StateContext)



    return(
        <>
            {
                isLoading ? <Loader /> : <Layout/>
            }


        </>
    )

}

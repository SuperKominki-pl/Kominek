"use client"
import PowerUsage from "@/components/_usage/PowerUsage";
import {StateContext} from "@/context/StateContext";
import {useContext} from "react";
import Loader from "@/components/Loader";
export default function Page() {


    const {isLoading} = useContext(StateContext)


    return (
        <div className={"relative px-[15px] pb-[150px]"}>
            {
                isLoading ? <Loader /> : <PowerUsage/>
            }
        </div>
    )
}
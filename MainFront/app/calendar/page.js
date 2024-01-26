"use client"
import CurrentMonthCalendar from "@/components/_calendar/Calendar";
import {StateContext} from "@/context/StateContext";
import Loader from "@/components/Loader";
import {useContext} from "react";

export default function Page() {

    const {isLoading} = useContext(StateContext)


    return (
        <div className={"relative px-[15px] pb-[150px]"}>
            {
                isLoading ? <Loader /> : <CurrentMonthCalendar/>
            }
        </div>
    )
}
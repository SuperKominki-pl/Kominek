"use client"
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";

export default function Header({navigation}) {

    const {
        devices,
        selectedDevice,
    } = useContext(StateContext)


    return (
        <div className={"py-[24px]"}>
            {
                navigation ? (
                    <div className={""}>
                        ikona
                    </div>
                ) : (
                    <div className={"text-center"}>
                        {
                            devices[selectedDevice].name
                        }
                    </div>
                )
            }
        </div>
    )
}
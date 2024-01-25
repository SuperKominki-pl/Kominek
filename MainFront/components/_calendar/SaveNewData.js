"use client"
import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import Icon from "@/public/assets/ic_back.svg";
import {StateContext} from "@/context/StateContext";
import {useContext, useState} from "react";

export default function SaveNewData({selectedDate}) {

    const {
        devices,
        selectedDevice,
        showSaveNewDataComponent,
        setShowSaveNewDataComponent,
        setDevices
    } = useContext(StateContext);

    const [time, setTime] = useState("12:00");


    return (
        <>
            <AnimatePresence>

                {
                    showSaveNewDataComponent && selectedDate && (
                        <motion.div
                            className={"fixed backdrop-blur-lg bg-[#000000]/80 h-screen w-full top-0 left-0 right-0 bottom-0 z-50 isolate"}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >

                            <motion.div
                                className={"bg-[#13131A] absolute bottom-0 w-full h-screen z-50 rounded-md px-[15px] pt-[32px] pb-[200px] overflow-y-scroll"}
                                initial={{y: "100%"}}
                                animate={{y: "0%"}}
                                exit={{y: "100%"}}
                                transition={{duration: .5, ease: "easeInOut"}}
                            >
                                <div className={"py-[24px] flex justify-between items-center"}>
                                    <Image src={Icon} alt={"icon"} className={"cursor-pointer"}
                                           onClick={() => setShowSaveNewDataComponent(false)}/>
                                    <div className={"text-greyTextColor text-[14px]"}>
                                        <label className={"font-[600]"}>Wybrana data: </label>
                                        <label>{selectedDate}</label>
                                    </div>
                                </div>

                                <p className={"text-greyTextColor mb-[8px] text-[14px]"}>Wybierz godzine</p>
                                <input type={"time"}
                                       value={time}
                                       onChange={(e) => setTime(e.target.value)}
                                       className={"bg-[#202129] px-[16px] py-[12px] rounded-lg text-greyTextColor text-[14px] w-full mb-4"}/>

                                <p className={"text-greyTextColor mb-[8px] text-[14px]"}>Wybierz preset</p>

                                <div className={"flex flex-col gap-4"}>
                                    {
                                        devices[selectedDevice].savedPresets ? devices[selectedDevice].savedPresets.map((preset, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        let newDevices = [...devices];
                                                        let deviceToUpdate = newDevices[selectedDevice];

                                                        let convertedDate = selectedDate.split(".").reverse().join("-");
                                                        let month = convertedDate.split("-")[1];
                                                        let day = convertedDate.split("-")[2];

                                                        if (month < 10) {
                                                            month = "0" + month;
                                                        }
                                                        if (day < 10) {
                                                            day = "0" + day;
                                                        }
                                                        convertedDate = convertedDate.split("-")[0] + "-" + month + "-" + day;


                                                        if (deviceToUpdate) {
                                                            deviceToUpdate.calendarData.push({
                                                                date: convertedDate,
                                                                time: time,
                                                                presetName: preset.header,
                                                            });

                                                            setDevices(newDevices);
                                                        }
                                                        setShowSaveNewDataComponent(false);

                                                    }
                                                    }
                                                    className={"text-center bg-[#202129] px-[16px] py-[12px] rounded-lg gap-[16px] cursor-pointer hover:bg-[#2C2E3D] transition-all"}>
                                                    <label>{preset.header}</label>
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
                            </motion.div>


                        </motion.div>
                    )
                }
            </AnimatePresence>


        </>
    )
}
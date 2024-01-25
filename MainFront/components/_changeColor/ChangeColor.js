"use client"

import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import {AnimatePresence, motion} from "framer-motion";
import ColorPresets from "@/components/_changeColor/ColorsPresets";
import Presets from "@/components/_changeColor/Presets";
import Icon from "../../public/assets/ic_back.svg"
import Image from "next/image";

export default function ChangeColor() {

    const {showChangeColorComponent, devices, selectedDevice, setShowChangeColorComponent} = useContext(StateContext);

    return (
        <>
            <AnimatePresence>

                {
                    showChangeColorComponent && (
                        <motion.div
                            className={"fixed backdrop-blur-lg bg-[#000000]/80 h-screen w-full top-0 left-0 right-0 bottom-0 z-50 isolate"}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >

                            <motion.div
                                className={"bg-[#13131A] absolute bottom-0 w-full h-screen z-40 rounded-md px-[15px] pt-[32px] pb-[200px] overflow-y-scroll"}
                                initial={{y: "100%"}}
                                animate={{y: "0%"}}
                                exit={{y: "100%"}}
                                transition={{duration: .5, ease: "easeInOut"}}
                            >
                                <div className={"py-[24px] flex justify-between items-center"}>
                                    <div
                                        onClick={() => setShowChangeColorComponent(false)}
                                        className={"aspect-square bg-backgroundLightColor flex items-center justify-center p-3 rounded-lg hover:bg-accentColor transition-all cursor-pointer"}>
                                        <Image src={Icon} alt={"icon"} width={15} height={20}
                                               className={"pointer-events-none"}/>
                                    </div>
                                    <div className={"flex-grow text-center text-[14px] font-bold"}>
                                        {
                                            devices[selectedDevice].name
                                        }
                                    </div>
                                </div>


                                <ColorPresets/>

                                <Presets/>


                            </motion.div>

                            <div className={"absolute w-full h-full top-0 z-0"}
                                 onClick={() => setShowChangeColorComponent(false)}
                            />
                        </motion.div>
                    )
                }
            </AnimatePresence>

        </>
    )
}
"use client"
import {StateContext} from "@/context/StateContext";
import {useContext, useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

const SavePreset = () => {

    const {showNamePreset, setShowNamePreset, devices, selectedDevice, setDevices} = useContext(StateContext);
    const [name, setName] = useState("");

    useEffect(() => {
        if (showNamePreset && showNamePreset.preset && showNamePreset.preset.header) {
            setName(showNamePreset.preset.header);
        }
    }, [showNamePreset]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const savePreset = () => {
        let newDevices = [...devices];
        let deviceToUpdate = newDevices[selectedDevice];

        if (deviceToUpdate) {
            deviceToUpdate.savedPresets.push({
                header: name,
                name: deviceToUpdate.colorPreset.name,
                settings: {
                    ...deviceToUpdate.colorPreset.settings
                }
            });

            setDevices(newDevices);
        }
    }


    return (
        <>
            <AnimatePresence>
                {
                    showNamePreset.status && showNamePreset.preset.header ? (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className={"fixed h-screen w-full top-0 left-0 right-0 bottom-0 z-50 isolate flex justify-center items-center"}
                        >
                            <div className={"z-50 absolute w-full px-10"}>
                                <div
                                    className={"text-black bg-backgroundColor flex flex-col gap-2 p-5 rounded-2xl focus:outline-none"}>
                                    <p className={"text-white"}>Nazwa presetu</p>
                                    <input type={"text"} value={name} placeholder={"Podaj nazwę..."}
                                           onChange={handleNameChange}
                                           className={"z-60 p-3 rounded-md bg-[#202129] text-white focus:outline-none w-full"}
                                            maxLength={20}
                                    />
                                    <button className={"w-full bg-accentColor text-black text-[14px] font-[600] py-2 rounded-md"}
                                            onClick={() => {
                                                savePreset();
                                                setShowNamePreset({
                                                    status: false,
                                                    preset: null,
                                                });

                                            }}
                                    >
                                        Zapisz
                                    </button>
                                </div>
                            </div>

                            <div
                                className={"fixed top-0 left-0 right-0 bottom-0 bg-black opacity-90 backdrop-blur-md z-20"}
                                onClick={() => setShowNamePreset({
                                    status: false,
                                    preset: null,
                                })}
                            />
                        </motion.div>
                    ) : null
                }
            </AnimatePresence>

        </>
    )
}


export default function Presets() {

    const {devices, selectedDevice, setDevices, setShowNamePreset} = useContext(StateContext);
    const maxPresets = 5;
    const presetsToFill = devices[selectedDevice].savedPresets ? maxPresets - devices[selectedDevice].savedPresets.length : maxPresets;

    const applyPreset = (preset) => {

        let newDevices = [...devices];
        let deviceToUpdate = newDevices[selectedDevice];

        if (deviceToUpdate) {

            deviceToUpdate.colorPreset = {
                ...deviceToUpdate.colorPreset,
                name: preset.name,
                settings: {
                    ...preset.settings
                }
            };

            setDevices(newDevices);
        }
    }
    const removePreset = (preset) => {
        let newDevices = [...devices];
        let deviceToUpdate = newDevices[selectedDevice];

        if (deviceToUpdate) {
            deviceToUpdate.savedPresets = deviceToUpdate.savedPresets.filter(item => item !== preset);

            setDevices(newDevices);
        }
    }
    // const savePreset = () => {
    //     let newDevices = [...devices];
    //     let deviceToUpdate = newDevices[selectedDevice];
    //
    //     if (deviceToUpdate) {
    //         deviceToUpdate.savedPresets.push({
    //             header: "Preset #" + (deviceToUpdate.savedPresets.length + 1),
    //             name: deviceToUpdate.colorPreset.name,
    //             settings: {
    //                 ...deviceToUpdate.colorPreset.settings
    //             }
    //         });
    //
    //         setDevices(newDevices);
    //     }
    // }


    return (
        <>

            <SavePreset/>

            <div>
                <div className={"flex justify-between py-6 font-[500] items-center"}>
                    <p className={"text-greyTextColor text-[14px]"}>Zapisane</p>
                    <label>
                        {
                            devices[selectedDevice].savedPresets ? devices[selectedDevice].savedPresets.length : 0
                        }
                        /5
                    </label>

                </div>


                <div className={"flex flex-col gap-2"}>
                    {
                        devices[selectedDevice].savedPresets && devices[selectedDevice].savedPresets.map((item, index) => {

                            let a;
                            const x = item.name;
                            switch (x) {
                                case "color":
                                    a = "Kolor";
                                    break;
                                case "pulse":
                                    a = "Puls";
                                    break;
                                case "wave":
                                    a = "Fala";
                                    break;
                                case "rainbow":
                                    a = "Tęcza";
                                    break;
                            }

                            return (
                                <div className={"flex w-full gap-2"} key={index}>
                                    <div
                                        onClick={
                                            () => applyPreset(item)
                                        }
                                        className={"flex-grow items-center bg-[#202129] px-[16px] py-[12px] rounded-lg flex gap-[16px] cursor-pointer hover:bg-[#2C2E3D] transition-all"}>
                                        <label className={"flex-grow font-[500] pointer-events-none"}>{item.header}</label>
                                        <label className={"text-[#9198A2] text-[13px] font-[500]"}>Tryb: {a}</label>

                                    </div>
                                    <button onClick={() => removePreset(item)}
                                            className={"bg-red-500 px-4 rounded-md hover:bg-red-600 transition-all"}>
                                        Usuń
                                    </button>
                                </div>

                            )
                        })
                    }
                    {
                        [...Array(presetsToFill)].map((item, index) => {
                                return (
                                    <div key={index}
                                         onClick={
                                             () => setShowNamePreset({
                                                 status: true,
                                                 preset: {
                                                     header: "Preset #" + (devices[selectedDevice].savedPresets.length + 1),
                                                     name: devices[selectedDevice].colorPreset.name,
                                                     settings: {
                                                         ...devices[selectedDevice].colorPreset.settings
                                                     }
                                                 }
                                             })
                                         }
                                         className={"items-center bg-[#13131A] border-2 border-[#202129] border-dashed px-[16px] py-[12px] rounded-lg flex gap-[16px] cursor-pointer hover:bg-[#202129] transition-all"}>
                                        <label className={"flex-grow font-[500] pointer-events-none"}>Zapisz
                                            ustawienia</label>
                                        <label className={"text-[#9198A2] text-[13px] font-[500]"}>dodaj</label>
                                    </div>
                                )
                            }
                        )
                    }


                </div>
            </div>
        </>
    )
}
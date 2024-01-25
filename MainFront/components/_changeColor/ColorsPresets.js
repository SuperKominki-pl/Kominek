"use clinet"
import {useContext, useEffect, useState} from "react";
import PlaceholderIcon from "../../public/assets/placeholder-icon.svg"
import Image from "next/image";
import {StateContext} from "@/context/StateContext";

export default function ColorPresets() {

    const {devices, selectedDevice, setDevices} = useContext(StateContext);

    const initialState = [
        {
            name: "color",
            title: "Kolor",
            icon: null,
            isSelected: false,
            settings: {
                lighting: 50,
                hue: 180
            }
        },
        {
            name: "pulse",
            title: "Puls",
            icon: null,
            isSelected: false,
            settings: {
                lighting: 50,
                hue: 180
            }
        },
        {
            name: "wave",
            title: "Fala",
            icon: null,
            isSelected: false,
            settings: {
                lighting: 50,
                hue: 180
            }
        },
        {
            name: "rainbow",
            title: "Tęcza",
            icon: null,
            isSelected: false,
            settings: {
                lighting: 50,
                hue: 180
            }
        }
    ]
    const [presets, setPresets] = useState(initialState)

    useEffect(() => {

        let newPresets = [...presets];

        newPresets.forEach((item, index) => {
            if (devices[selectedDevice].colorPreset.name === item.name) {
                newPresets[index].isSelected = true;
            } else {
                newPresets[index].isSelected = false;
            }
        })

        setPresets(newPresets);
    }, [devices]);

    const changeDeviceColorPreset = (index) => {
        let newDevices = [...devices];
        newDevices[selectedDevice].colorPreset = presets[index];
        setDevices(newDevices);
    }

    const handleHueChange = (e) => {
        const newHue = e.target.value;
        let newDevices = [...devices];
        let deviceToUpdate = newDevices[selectedDevice];

        if (deviceToUpdate && deviceToUpdate.colorPreset && deviceToUpdate.colorPreset.settings) {
            deviceToUpdate.colorPreset.settings.hue = parseInt(newHue);
            setDevices(newDevices);
        }
    }

    const handleLightingChange = (e) => {
        const newLighting = e.target.value;
        let newDevices = [...devices];
        let deviceToUpdate = newDevices[selectedDevice];

        if (deviceToUpdate && deviceToUpdate.colorPreset && deviceToUpdate.colorPreset.settings) {
            deviceToUpdate.colorPreset.settings.lighting = parseInt(newLighting);
            setDevices(newDevices);
        }
    }

    //create useEffect that change color of color-slider background based on hue value
    useEffect(() => {
            const slider = document.querySelector("#color-slider");
            const hue = devices[selectedDevice].colorPreset.settings.hue;
            slider.style.background = `hsl(${hue}, 100%, ${devices[selectedDevice].colorPreset.settings.lighting}%)`;
        }
        , [devices[selectedDevice].colorPreset.settings.hue, devices[selectedDevice].colorPreset.settings.lighting])


    return (
        <div>
            <div>
                <p className={"text-greyTextColor text-[14px]"}>Tryb naświetlenia</p>

                <div className={"mt-[16px]"}>
                    <div className={"flex gap-2"}>
                        {
                            presets.map((item, index) => {
                                return (
                                    <div key={index}
                                         onClick={() => changeDeviceColorPreset(index)}
                                         className={`flex-1 flex justify-center items-center flex-col gap-3 bg-[#202129] py-5 rounded-md cursor-pointer transition-all ${
                                             item.isSelected ? "border-2 border-[#18E8B7] bg-[#0F0F15] shadow-2xl" : "border-2 border-[#3B3E50]"
                                         }`}>
                                        {/*<Image src={*/}
                                        {/*    item.icon ? item.icon : PlaceholderIcon*/}
                                        {/*} alt={"Icon"} width={18} height={18}/>*/}
                                        <p className={"text-[12px]"}>
                                            {
                                                item.title
                                            }
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>
            </div>
            <div className={"mt-[42px] flex flex-col gap-[24px]"}>
                <div className={"flex flex-col text-center gap-[8px]"}>
                    <label>Jasność</label>
                    <input type="range" id={"color-slider"} className={"color-range"} step={10} min={0} max={100}
                           value={devices[selectedDevice].colorPreset.settings.lighting}
                           onChange={
                               (e) => handleLightingChange(e)
                           }

                    />
                </div>
                <div className={"flex flex-col text-center gap-[8px]"}>
                    <label>Kolor</label>
                    <input id={"slider"} type="range" className={"rainbow-range"} step={10} min={0} max={360}
                           value={devices[selectedDevice].colorPreset.settings.hue} onChange={
                        (e) => handleHueChange(e)
                    }
                    />
                </div>

            </div>
        </div>
    )
}
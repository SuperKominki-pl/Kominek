"use clinet"
import {useContext, useEffect, useState} from "react";
import PlaceholderIcon from "../../public/assets/placeholder-icon.svg"
import Image from "next/image";
import {StateContext} from "@/context/StateContext";

export default function ColorPresets() {

    const {devices, selectedDevice, setDevices} = useContext(StateContext);
    const [convertedColor, setConvertedColor] = useState("");

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
    const [mode, setMode] = useState("");

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

        setMode(presets[index].name);
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

            const hslToHex = (h, s, l) => {
                l /= 100;
                const a = s * Math.min(l, 1 - l) / 100;
                const f = n => {
                    const k = (n + h / 30) % 12;
                    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
                };
                return `#${f(0)}${f(8)}${f(4)}`;
            }
            const hex = hslToHex(hue, 100, devices[selectedDevice].colorPreset.settings.lighting);
            setConvertedColor(hex)
        }
        , [devices[selectedDevice].colorPreset.settings.hue, devices[selectedDevice].colorPreset.settings.lighting])


    useEffect(() => {

        const timeout = setTimeout(() => {
            const response = fetch(`/api/changeColor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: selectedDevice + 1,
                    color: convertedColor
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }, 1500)

        return () => clearTimeout(timeout)

    }, [convertedColor]);

    // useEffect(() => {
    //
    //     const timeout = setTimeout(() => {
    //         const response = fetch(`/api/changeMode`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 deviceId: selectedDevice + 1,
    //                 mode: mode
    //             }),
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 console.log('Success:', data);
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //             });
    //     }, 1500)
    //
    //     return () => clearTimeout(timeout)
    //
    // }, [mode]);



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
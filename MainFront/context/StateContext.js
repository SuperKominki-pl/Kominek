"use client"

import {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";

export const StateContext = createContext({});


export default function StateContextProvider({children}) {

    const [deviceOneData, setDeviceOneData] = useState();
    const [deviceTwoData, setDeviceTwoData] = useState();
    const [devices, setDevices] = useState([]); // Initialize devices as an empty array
    const [isLoading, setIsLoading] = useState(true);


    useEffect(async () => {

        const response = await fetch("/api/getDevice" ,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                deviceId: 1,
            })
        });

        const data = await response.json();
        setDeviceOneData(data.device);

        const response2 = await fetch("/api/getDevice" ,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                deviceId: 2,
            })
        });

        const data2 = await response2.json();
        setDeviceTwoData(data2.device);
    }, []);


    // const initialData = [
    //     {
    //         name: "FIRE-K20S2",
    //         temperature: 22.2,
    //         desc: "Kominek W sypialni",
    //         status: 1,
    //         color: "#d33131",
    //         colorPreset: {
    //             name: "color",
    //             title: "Kolor",
    //             icon: null,
    //             isSelected: true,
    //             settings: {
    //                 lighting: 30,
    //                 hue: 120,
    //             }
    //         },
    //         powerUsageData: [
    //             {
    //                 id: "weekUsagePiecyk2",
    //                 labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
    //                 data: [1.1, 1.3, 1.3, 1.9, 1.3, 0.9, 1.2] // wygenerowane wartości w kWh dla tygodnia
    //             },
    //             {
    //                 id: "monthUsagePiecyk2",
    //                 labels: ['St.', "Lut.", "Mar.", "Kwi.", "Maj.", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
    //                 data: [41.2, 50.2, 45.4, 50.1, 48.3, 45.4, 39.4, 46.9, 42.8, 32.8, 57.3, 58.8] // wygenerowane wartości w kWh dla miesiąca
    //             }
    //         ],
    //         savedPresets: [],
    //         calendarData: [
    //             {
    //                 id: 1,
    //                 date: "2024-01-04",
    //                 time: "16:00",
    //                 presetName: "preset #2",
    //             },
    //         ]
    //     },
    //     {
    //         name: "FIRE-WK1LMS",
    //         temperature: 23,
    //         desc: "Salon",
    //         status: 0,
    //         color: "#fff",
    //         colorPreset: {
    //             name: "wave",
    //             title: "Fala",
    //             icon: null,
    //             isSelected: true,
    //             settings: {
    //                 lighting: 50,
    //                 hue: 320,
    //             }
    //         },
    //         powerUsageData: [
    //             {
    //                 id: "weekUsage",
    //                 labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
    //                 data: [1.2, 0.8, 1.0, 1.5, 1.3, 1.6, 1.4] // wartości w kWh
    //             },
    //             {
    //                 id: "monthUsage",
    //                 labels: ['St.', "Lut.", "Mar.", "Kwi.", "Maj.", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
    //                 data: [45, 40, 42, 50, 38, 45, 48, 46, 37, 50, 48, 44] // wartości w kWh
    //             }
    //         ],
    //         savedPresets: [
    //             {
    //                 header: "Preset #1",
    //                 name: "color",
    //                 settings: {
    //                     lighting: 0,
    //                     hue: 0,
    //                 }
    //             },
    //         ],
    //         calendarData: [
    //             {
    //                 id: 1,
    //                 date: "2024-01-25",
    //                 time: "12:00",
    //                 presetName: "preset #1",
    //             },
    //             {
    //                 id: 2,
    //                 date: "2024-01-26",
    //                 time: "12:00",
    //                 presetName: "preset #2",
    //             },
    //         ]
    //     }
    // ];

    useEffect(() => {
        const fetchDeviceData = async () => {
            const fetchData = async (deviceId) => {
                const response = await fetch("/api/getDevice", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ deviceId })
                });
                return (await response.json()).device;
            };

            const deviceOne = await fetchData(1);
            const deviceTwo = await fetchData(2);

            setDeviceOneData(deviceOne);
            setDeviceTwoData(deviceTwo);

            const savedData = Cookies.get("data");
            if (!savedData) {
                setDevices([
                    // Device One initial data
                    {
                        // id : deviceOne.id,
                        name: "FIRE-K20S2",
                        temperature: deviceOne.temperature,
                        desc: "Kominek W sypialni",
                        status: deviceOne.status === "On" ? 1 : 0,
                        color: deviceOne.color,
                        colorPreset: {
                            name:  deviceOne.mode,
                            title: "Kolor",
                            icon: null,
                            isSelected: true,
                            settings: {
                                lighting: 30,
                                hue: 120,
                            }
                        },
                        powerUsageData: [
                            {
                                id: "weekUsagePiecyk2",
                                labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
                                data: [1.1, 1.3, 1.3, 1.9, 1.3, 0.9, 1.2]
                            },
                            {
                                id: "monthUsagePiecyk2",
                                labels: ['St.', "Lut.", "Mar.", "Kwi.", "Maj.", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
                                data: [41.2, 50.2, 45.4, 50.1, 48.3, 45.4, 39.4, 46.9, 42.8, 32.8, 57.3, 58.8]
                            }
                        ],
                        savedPresets: [],
                        calendarData: [
                            {
                                id: 1,
                                date: "2024-01-04",
                                time: "16:00",
                                presetName: "preset #2",
                            },
                        ]
                    },
                    // Device Two initial data
                    {
                        // id:  deviceTwo.id,
                        name: "FIRE-WK1LMS",
                        temperature: deviceTwo.temperature,
                        desc: "Salon",
                        status: deviceTwo.status === "On" ? 1 : 0,
                        color: deviceTwo.color,
                        colorPreset: {
                            name: deviceTwo.mode,
                            title: "Fala",
                            icon: null,
                            isSelected: true,
                            settings: {
                                lighting: 50,
                                hue: 320,
                            }
                        },
                        powerUsageData: [
                            {
                                id: "weekUsage",
                                labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
                                data: [1.2, 0.8, 1.0, 1.5, 1.3, 1.6, 1.4]
                            },
                            {
                                id: "monthUsage",
                                labels: ['St.', "Lut.", "Mar.", "Kwi.", "Maj.", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
                                data: [45, 40, 42, 50, 38, 45, 48, 46, 37, 50, 48, 44]
                            }
                        ],
                        savedPresets: [
                            {
                                header: "Preset #1",
                                name: "color",
                                settings: {
                                    lighting: 0,
                                    hue: 0,
                                }
                            },
                        ],
                        calendarData: [
                            {
                                id: 1,
                                date: "2024-01-25",
                                time: "12:00",
                                presetName: "preset #1",
                            },
                            {
                                id: 2,
                                date: "2024-01-26",
                                time: "12:00",
                                presetName: "preset #2",
                            },
                        ]

                    }
                ]);
            } else {
                setDevices(JSON.parse(decodeURIComponent(savedData)));
            }

            setIsLoading(false);
        };

        fetchDeviceData();
    }, []);




    useEffect(() => {
        // Update cookies whenever devices state changes
        if (devices.length > 0) {
            Cookies.set("data", JSON.stringify(devices));
        }
    }, [devices]);


    const [selectedDevice, setSelectedDevice] = useState(0);
    const [showChangeColorComponent, setShowChangeColorComponent] = useState(false);
    const [showSaveNewDataComponent, setShowSaveNewDataComponent] = useState(false);
    const [powerUsageData, setPowerUsageData] = useState(0);
    const [showNamePreset, setShowNamePreset] = useState({
        status: false,
        preset: null,
    });
    const [showSetNameAndDescComponent, setShowSetNameAndDescComponent] = useState({
        status: false,
        device: {},
    });

    const changeDeviceStatus = (index) => {
        let newDevices = [...devices];
        newDevices[index].status = newDevices[index].status === 1 ? 0 : 1;
        setDevices(newDevices);
    }

    const updateDeviceTemperature = (newTemperature) => {
        let newDevices = [...devices];
        newDevices[selectedDevice].temperature = newTemperature;
        setDevices(newDevices);
    };


    useEffect(() => {

        const timeout = setTimeout(() => {
            const response = fetch(`/api/changeMode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: selectedDevice + 1,
                    mode: devices[selectedDevice].colorPreset.name
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

    }, [devices]);


    return (
        <StateContext.Provider
            value={{
                devices,
                setDevices,
                selectedDevice,

                setSelectedDevice,
                changeDeviceStatus,
                updateDeviceTemperature,
                showChangeColorComponent,
                setShowChangeColorComponent,

                powerUsageData,
                setPowerUsageData,
                showSaveNewDataComponent,
                setShowSaveNewDataComponent,
                showNamePreset,
                setShowNamePreset,

                showSetNameAndDescComponent,
                setShowSetNameAndDescComponent,
                isLoading,

                deviceTwoData,
                deviceOneData,
            }}>
            {children}
        </StateContext.Provider>
    )

}
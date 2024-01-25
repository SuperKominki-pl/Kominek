"use client"
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import {useContext, useEffect, useState} from "react";
import {StateContext} from "@/context/StateContext";
import Header from "@/components/header/Header";

export default function PowerUsage() {

    const {
        devices,
        selectedDevice,
        powerUsageData,
        setPowerUsageData,
        setSelectedDevice
    } = useContext(StateContext)

    const [activePointIndex, setActivePointIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (devices[selectedDevice].powerUsageData) {
            setLoading(false);
        }
    }, []);
    const [currentValue, setCurrentValue] = useState(devices[selectedDevice].powerUsageData[powerUsageData].data[0]);

    const handleClick = (label, value) => {
        setCurrentValue(value);
    };

    const data = {
        labels: devices[selectedDevice].powerUsageData[powerUsageData].labels,
        datasets: [
            {
                label: 'Zużycie prądu',
                data: devices[selectedDevice].powerUsageData[powerUsageData].data,
                fill: false,
                // backgroundColor: 'rgb(24, 232, 183)',
                borderColor: 'rgba(24, 232, 183)',
                tension: 0.5,
                hoverRadius: 10,
                borderWidth: 3,
                pointRadius: 10,
                pointBackgroundColor: function (context) {
                    // Zmiana koloru tła dla punktu, który został kliknięty
                    return context.dataIndex === activePointIndex ? '#202129' : 'rgba(24, 232, 183)';
                },

            },
        ],
    };

    const options = {

        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const elementIndex = elements[0].index;
                const datasetIndex = elements[0].datasetIndex;
                const value = chart.data.datasets[datasetIndex].data[elementIndex];
                const label = chart.data.labels[elementIndex];
                setActivePointIndex(elementIndex);

                handleClick(label, value);
            }
        },


        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false,
            },
        },

        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false
                }
            },
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: '#2D2D39',
                }
            }


        }
    };
    const powerUsageProfiles = [
        {
            id: "weekUsage",
            title: "Dzień"
        },
        {
            id: "monthUsage",
            title: "Miesiąc"
        }
    ]

    useEffect(() => {
        setCurrentValue(devices[selectedDevice].powerUsageData[powerUsageData].data[0]);
        setActivePointIndex(0);
    }, [powerUsageData, selectedDevice]);


    return (

        <>
            {/*<Header/>*/}


            <section className={"flex justify-center mt-[15px] mb-[12px]"}>
                <div
                    className={"py-[32px] w-full px-[21px] bg-[#202129] rounded-2xl flex flex-col justify-center items-center"}>
                    <p className={"text-greyTextColor"}>Zużycie prądu</p>
                    <p className={"text-[52px] flex items-center gap-2 font-[600]"}>{currentValue} <span
                        className={"text-[14px] text-accentColor"}>kwh</span></p>
                </div>
            </section>


            <section className={"bg-[#202129] p-5 rounded-2xl"}>

                {
                    loading ? <div
                            className={"w-full h-60 bg-[#202129] animate-pulse grid place-items-center"}>Ładowanie...</div> :
                        <Line data={data} options={options}/>
                }
            </section>

            <section className={"flex gap-4 my-5 items-center justify-center"}>
                {
                    powerUsageProfiles.map((profile, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => setPowerUsageData(index)}
                                className={`border-2  px-6 py-2 rounded-full transition-all duration-300 hover:bg-[#0F0F15] hover:border-[#fff]
                                ${powerUsageData === index ? "bg-[#0F0F15] border-[#18E8B7]" : "border-[#202129] bg-[#202129]"}
                                `}>
                                {profile.title}
                            </button>
                        )
                    })
                }
            </section>

            <section className={"mt-5"}>
                <p className={"text-greyTextColor mb-[8px] text-[14px]"}>Urządzenia</p>

                {
                    devices.map((item, index) => {
                        return (
                            <div key={index} className={"flex gap-4 my-5 w-full"}>
                                <button
                                    onClick={() => setSelectedDevice(index)}
                                    className={`border-2 w-full px-6 py-2 rounded-md transition-all duration-300 hover:bg-[#0F0F15] hover:border-[#fff] text-left
                                ${selectedDevice === index ? "bg-[#0F0F15] border-[#18E8B7]" : "border-[#202129] bg-[#202129]"}
                                `}>
                                    {item.name}

                                </button>
                            </div>
                        )
                    })
                }
            </section>


        </>


    )

}
"use client"
import {StateContext} from "@/context/StateContext";
import {useContext, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";


const SetNameAndDescription = () => {


    const {
        devices,
        selectedDevice,
        setDevices,
        showSetNameAndDescComponent,
        setShowSetNameAndDescComponent
    } = useContext(StateContext);

    const [name, setName] = useState( "");
    const [desc, setDesc] = useState("");

    useEffect(() => {
      if(showSetNameAndDescComponent.status){
          setName(showSetNameAndDescComponent.device.name);
          setDesc(showSetNameAndDescComponent.device.desc);
      }
    }, [showSetNameAndDescComponent.status]);





    return (
        <>
            <AnimatePresence>
                {
                    showSetNameAndDescComponent.status ? (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className={"fixed h-screen w-full top-0 left-0 right-0 bottom-0 z-50 isolate flex justify-center items-center"}
                        >
                            <div className={"z-50 absolute w-full px-5"}>
                                <div
                                    className={"text-black bg-backgroundColor flex flex-col gap-6 p-5 rounded-2xl focus:outline-none"}>
                                    <div>
                                        <p className={"text-white mb-2"}>Nazwa kominka</p>
                                        <input type={"text"}
                                               placeholder={"Podaj nazwę..."}
                                               className={"z-60 p-3 rounded-md bg-[#202129] text-white focus:outline-none w-full"}
                                               maxLength={20}
                                               value={name}
                                               onChange={
                                                   (e) => {
                                                       setName(e.target.value);
                                                   }
                                               }

                                        />
                                    </div>

                                    <div>
                                        <p className={"text-white mb-2"}>Opis kominka</p>

                                        <input type={"text"}
                                               placeholder={"Podaj nazwę..."}
                                               className={"z-60 p-3 rounded-md bg-[#202129] text-white focus:outline-none w-full"}
                                               maxLength={20}
                                               value={desc}
                                               onChange={
                                                   (e) => {
                                                       setDesc(e.target.value);
                                                   }
                                               }
                                        />

                                    </div>

                                    <button
                                        className={"w-full bg-accentColor text-black text-[14px] font-[600] py-2 rounded-md"}
                                        onClick={() => {
                                            let newDevices = [...devices];
                                            newDevices[selectedDevice].name = name;
                                            newDevices[selectedDevice].desc = desc;
                                            setDevices(newDevices);
                                            setShowSetNameAndDescComponent({
                                                status: false,
                                                item: {}
                                            });
                                        }}
                                    >
                                        Zapisz
                                    </button>
                                </div>
                            </div>

                            <div
                                className={"fixed top-0 left-0 right-0 bottom-0 bg-black opacity-90 backdrop-blur-md z-20"}
                                onClick={() =>
                                    setShowSetNameAndDescComponent({
                                        status: false,
                                        item: {}
                                    })
                                }
                            />
                        </motion.div>
                    ) : null
                }
            </AnimatePresence>

        </>
    )
}


export default function Devices() {

    const {
        devices,
        selectedDevice,
        setSelectedDevice,
        changeDeviceStatus,
        setShowChangeColorComponent,
        setShowSetNameAndDescComponent
    } = useContext(StateContext)



    const handleChangeStatus = async (index, status) => {

        changeDeviceStatus(index - 1);

        const response = await (await fetch(`/api/changeStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                deviceId: index,
                status: status
            })
        })).json();

        if (response.status === "ok") {
            console.log("Status changed");
        }else{
            console.log("Something went wrong");
        }

    }


    return (
        <>

            <SetNameAndDescription/>


            <div className={"mt-[21px] text-[14px] font-[500]"}>
                <p className={"text-greyTextColor mb-[8px]"}>Urządzenia</p>
                <div className={"flex flex-col gap-2"}>
                    {
                        devices.map((item, index) => {
                            return (
                                <div
                                    onClick={() => setSelectedDevice(index)}
                                    key={index}
                                    className={`border-2 p-[24px] rounded-2xl transition-all ${
                                        index === selectedDevice ? "border-[#18E8B7]" : "border-[#3B3E50] bg-[#202129]"
                                    }`}>
                                    <div className={"flex justify-between"}>
                                        <h1 className={"font-[700] text-[20px]"}
                                            onClick={() => {
                                                setShowSetNameAndDescComponent({
                                                    status: true,
                                                    device: {
                                                        name: item.name,
                                                        desc: item.desc,
                                                    }
                                                })
                                            }}
                                        >
                                            {item.name}
                                        </h1>
                                        <div>
                                            <div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox"
                                                           checked={
                                                               item.status === 1
                                                           }
                                                           onChange={
                                                               () => handleChangeStatus(index + 1 , item.status)


                                                    }
                                                           value={
                                                               item.status === 1
                                                           }
                                                           className="sr-only peer"/>
                                                    <div
                                                        className="w-11 h-6 bg-[#13131A] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18E8B7]"></div>
                                                </label>
                                            </div>
                                            <div>on/off</div>
                                        </div>
                                    </div>

                                    <div className={"mt-[16px]"}>
                                        <p className={`text-[#18E8B7] text-[16px] font-[400] transition-all ${
                                            item.status === 1 ? "text-[#18E8B7]" : "text-[#9198A2]"
                                        }`}>{item.desc}</p>
                                        <p className={`transition-all ${
                                            item.status === 1 ? "text-white" : "text-red-500"
                                        }`}>
                                            <span className={"font-[500]"}>Status: </span>
                                            <span className={""}>
                                                {item.status === 1 ? "Włączony" : "Wyłączony"}
                                            </span>
                                        </p>
                                    </div>

                                    <div className={"mt-[16px] flex justify-between items-center "}>
                                        <p className={"text-[#9198A2]"}>Kolor płomienia</p>
                                        <button
                                            className={"px-4 rounded-full bg-[#2E3040] flex gap-3 py-2 cursor-pointer"}
                                            onClick={() => setShowChangeColorComponent(true)}
                                        >
                                            Zmień kolor
                                        </button>


                                        {/*<div className={"rounded-full bg-[#2E3040] flex gap-3 p-2 cursor-pointer"}*/}
                                        {/*    onClick={() => setShowChangeColorComponent(true)}*/}
                                        {/*>*/}
                                        {/*    /!*<span className={`block w-[24px] h-[24px] aspect-square rounded-full`}*!/*/}
                                        {/*    /!*      style={{*!/*/}
                                        {/*    /!*          backgroundColor: item.color*!/*/}
                                        {/*    /!*      }}*!/*/}
                                        {/*    /!*>*!/*/}
                                        {/*    /!*</span>*!/*/}
                                        {/*    <button className={"px-3"}>Zmień kolor</button>*/}
                                        {/*</div>*/}
                                    </div>

                                </div>

                            )
                        })
                    }

                </div>
            </div>

            {/*<pre>*/}
            {/*    {JSON.stringify(devices, null, 2)}*/}
            {/*</pre>*/}


        </>
    )
}
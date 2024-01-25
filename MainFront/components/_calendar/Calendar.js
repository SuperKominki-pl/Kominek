"use client"
import Header from "@/components/header/Header";
import {useContext, useEffect, useState} from "react";
import {StateContext} from "@/context/StateContext";
import SaveNewData from "@/components/_calendar/SaveNewData";
import ArrowRight from "@/public/assets/arrow-small-right.svg";
import ArrowLeft from "@/public/assets/arrow-small-left.svg";
import Image from "next/image";


const Calendar = ({year, month, setSelectedDate}) => {


    const {devices, selectedDevice, setShowSaveNewDataComponent} = useContext(StateContext);

    const firstDay = new Date(year, month).getDay() - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate() - 1;
    const daysInLastMonth = new Date(year, month, 0).getDate();
    const lastDay = new Date(year, month, daysInMonth).getDay() - 1;

    const days = [];
    for (let i = firstDay; i > 0; i--) {
        days.push(daysInLastMonth - i + 1);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    for (let i = 1; i < 7 - lastDay; i++) {
        days.push(i);
    }


    const isDateInCurrentMonth = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear() === year && date.getMonth() === month;
    };

    let events = [];
    const selectedDeviceCalendarData = devices[selectedDevice]?.calendarData || [];

    selectedDeviceCalendarData.forEach(event => {
        if (isDateInCurrentMonth(event.date)) {
            const day = new Date(event.date).getDate();
            events.push(day);
        }
    });


    return (
        <div className="inline-block bg-[#13131A] text-white rounded-lg py-5 w-full">
            <div className="grid grid-cols-7 gap-1 text-[11px]">
                {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map(day => (
                    <div key={day} className="flex items-center justify-center h-10">{day}</div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <div key={index}
                         onClick={() => {
                             setShowSaveNewDataComponent(true)
                             setSelectedDate(`${day}.${month + 1}.${year}`)
                         }}
                         className={`rounded-md flex items-center justify-center h-10 relative cursor-pointer ${index < firstDay || index >= firstDay + daysInMonth ? 'bg-[#17171E]' : 'bg-[#202129]'}`}>
                        {day}

                        {
                            // Check if the day is part of the current month and if it has an event
                            index >= firstDay && index < firstDay + daysInMonth && events.includes(day) && (
                                <span className={"absolute top-1.5 right-1.5 rounded-full h-[5px] w-[5px] bg-accentColor"}/>
                            )
                        }

                    </div>
                ))}
            </div>


        </div>
    );
};


export default function CurrentMonthCalendar() {

    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const {devices, selectedDevice, setDevices} = useContext(StateContext);


    useEffect(() => {
        switch (currentMonth) {
            case 0:
                setMonth("Styczeń")
                break;
            case 1:
                setMonth("Luty")
                break;
            case 2:
                setMonth("Marzec")
                break;
            case 3:
                setMonth("Kwiecień")
                break;
            case 4:
                setMonth("Maj")
                break;
            case 5:
                setMonth("Czerwiec")
                break;
            case 6:
                setMonth("Lipiec")
                break;
            case 7:
                setMonth("Sierpień")
                break;
            case 8:
                setMonth("Wrzesień")
                break;
            case 9:
                setMonth("Październik")
                break;
            case 10:
                setMonth("Listopad")
                break;
            case 11:
                setMonth("Grudzień")
                break;

            default:
                break;

        }
    }, [currentMonth]);

    const decreaseMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }

    }
    const increaseMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    useEffect(() => {
        if (currentDate) {
            setLoading(false)
        }
    }, [currentDate]);

    const [selectedDate, setSelectedDate] = useState(null);

   //create function to remove event from device by index
    const removeEventFromDeviceByIndex = (index) => {
        const newDevices = [...devices];
        newDevices[selectedDevice].calendarData.splice(index, 1);
        setDevices(newDevices);
    }


    return (
        <>
            <SaveNewData selectedDate={selectedDate}/>


            {
                loading ? (
                        <div className={"flex justify-center items-center h-screen animate-pulse"}>
                            <p>Ładowanie...</p>
                        </div>
                    ) :
                    null
            }


            {/*<Header/>*/}

            <section className={"flex justify-center mt-[15px] mb-[12px]"}>
                <div
                    className={"py-[32px] w-full px-[21px] bg-[#202129] rounded-2xl flex flex-col justify-center items-center"}>
                    <p className={"text-greyTextColor"}>Harmonogram zadań</p>
                    <p className={"text-[52px] flex items-center gap-2 font-[600]"}>
                        {devices[selectedDevice].calendarData.length}
                        <span className={"text-[14px] text-accentColor"}>łącznie</span></p>
                </div>
            </section>

            <section className={"relative flex gap-1 items-center text-[12px] flex-wrap"}>
                <div className={"px-7 py-1 bg-backgroundLightColor rounded-full flex-grow text-center"}>
                    {currentYear} {month}
                </div>

                <button className={"py-1 px-3 bg-backgroundLightColor  rounded-full"}
                        onClick={decreaseMonth}>
                    <Image className={"nav-icon"} src={ArrowLeft} alt={"arrow left"} width={15} height={15} />
                </button>
                <button className={"py-1 px-3 bg-backgroundLightColor  rounded-full"}
                        onClick={increaseMonth}>
                    <Image className={"nav-icon"} src={ArrowRight} alt={"arrow left"} width={15} height={15}/>
                </button>
            </section>

            <section>
                <Calendar year={currentYear} month={currentMonth} setSelectedDate={setSelectedDate}/>
            </section>
            <section>
                <p className={"text-greyTextColor mb-[8px] text-[14px]"}>Zaplanowane zadania</p>
                <div className={"mt-[8px] flex flex-col gap-2"}>
                    {
                        devices[selectedDevice].calendarData.map((event, index) => {


                            const convertDate = (date) => {
                                const dateObj = new Date(date);
                                const day = dateObj.getDate();
                                const month = dateObj.getMonth() + 1;
                                const year = dateObj.getFullYear();
                                return `${day}.${
                                    month < 10 ? `0${month}` : `${month}`
                                }.${year}`
                            }

                            return (
                                <div
                                    key={index}
                                    className={`border-2 p-[24px] rounded-2xl transition-all border-[#3B3E50] bg-[#202129]`}>
                                    <div className={"flex flex-col"}>
                                        <div className={"flex justify-between"}>
                                            <h1 className={"font-[700] text-[20px]"}>
                                                {event.presetName}
                                            </h1>
                                            <div className={"flex gap-2"}>
                                                <button
                                                    className={`px-4 rounded-full bg-[#2E3040] flex gap-3 py-2 cursor-pointer text-[12px]`}
                                                    onClick={(()=>removeEventFromDeviceByIndex(index))}
                                                >
                                                    Usuń
                                                </button>
                                            </div>
                                        </div>

                                        <div className={"mt-[8px]"}>
                                            <p className={`text-[#18E8B7] text-[16px] font-[400] transition-all`}>{convertDate(event.date)}</p>
                                            <p className={`transition-all text-[#9198A2]`}>
                                                <span className={"font-[600]"}>Godzina: </span>
                                                <span className={""}>
                                                {event.time}
                                            </span>
                                            </p>
                                        </div>
                                    </div>




                                </div>
                            )
                        })
                    }
                </div>


            </section>
        </>
    )
}
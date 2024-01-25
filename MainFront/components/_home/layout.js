import Header from "@/components/header/Header";
import Temperature from "@/components/_home/Temperature";
import Devices from "@/components/_home/Devices";
import Menu from "@/components/Menu/Menu";
import ChangeColor from "@/components/_changeColor/ChangeColor";
import Navigation from "@/components/Navigation/Navigation";

export default function Layout() {
    return (
        <>
            {/*<Header/>*/}

            <div className={"px-[15px] flex flex-col pb-[150px] pt-[15px]"}>

                <ChangeColor/>

                <Temperature/>

                <Devices/>

            </div>

            {/*<Menu/>*/}
        </>
    )
}
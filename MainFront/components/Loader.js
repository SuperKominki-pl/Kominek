import Image from "next/image";
import Logo from "../public/assets/logo.svg"


export default function Loader(){
    return(
        <div className={"h-screen w-screen flex justify-center items-center flex-col gap-3 animate-pulse"}>
            <Image src={Logo} alt={"logo"} width={120} height={120}/>
        </div>

    )
}
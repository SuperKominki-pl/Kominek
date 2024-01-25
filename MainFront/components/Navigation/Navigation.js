import PlaceholderIcon from "../../public/assets/placeholder-icon.svg"
import HomeIcon from "../../public/assets/home.svg"
import ContactIcon from "../../public/assets/paper-plane.svg"
import CalendarIcon from "../../public/assets/calendar.svg"
import StatIcon from "../../public/assets/stats.svg"
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {

    const collection = [
        {
            title: "Główna",
            icon: HomeIcon,
            href: "/"
        },
        {
            title: "Kontakt",
            icon: ContactIcon,
            href: "/contact"
        },
        {
            title: "Moc",
            icon: StatIcon,
            href: "/usage"
        },
        {
            title: "Kalendarz",
            icon: CalendarIcon,
            href: "/calendar"
        }
    ]

    return (
        <div className={"fixed bottom-0 w-screen"}>
            <div className={"bg-[#0D0D13] flex justify-between px-3 py-5 gap-3 shadow-2xl shadow-accentColor"}>
                {
                    collection.map((item, index) => {
                        return (
                            <Link key={index} href={item.href} className={"bg-backgroundColor aspect-video flex flex-col gap-2 justify-center items-center rounded-lg flex-1 transition-all"}>
                                <Image className={"nav-icon"}src={item.icon} alt={item.title} width={21} height={21}/>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}
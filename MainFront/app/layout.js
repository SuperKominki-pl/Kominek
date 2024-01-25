import '../public/styles/main.scss'
import localFont from 'next/font/local'
import StateContextProvider from "@/context/StateContext";
import Header from "@/components/header/Header";
import Navigation from "@/components/Navigation/Navigation";


export const metadata = {
    title: 'Projekt Kominka do szkoły',
    description: 'description',
}


const pretendard = localFont({
    src: "../public/assets/fonts/Pretendard.ttf",
    variable: "--font-pretendard",
})


export default function RootLayout({children}) {
    return (
        <html lang="pl">
        <body className={`${pretendard.variable} relative`}>
        <StateContextProvider>

            {children}

            <Navigation/>
        </StateContextProvider>
        </body>
        </html>
    )
}

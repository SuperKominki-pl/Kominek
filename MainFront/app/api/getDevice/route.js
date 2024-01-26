import {NextResponse} from "next/server";
export async function POST(req) {



    const body = await req.json();
    const {deviceId} = await body;
    const url = `http://51.68.155.42:5000/info/${deviceId}`;


    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        return NextResponse.json({status: "ok", device: data});
    }catch (e){
        return NextResponse.json({status: "error", message: "Something went wrong"});
    }




}

import {NextResponse} from "next/server";
export async function POST(req) {



    const body = await req.json();
    const {deviceId, mode} = await body;
    const url = `http://51.68.155.42:5000/change_mode/${deviceId}`;


    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: mode
            })
        });

        return NextResponse.json({status: "ok", message: "Mode changed"});
    }catch (e){
        return NextResponse.json({status: "error", message: "Something went wrong"});
    }




}

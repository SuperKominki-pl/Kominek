import {NextResponse} from "next/server";
export async function POST(req, res) {



    const body = await req.json();
    const {deviceId, status} = await body;
    const url = `http://51.68.155.42:5000/change_status/${deviceId}`;


   try{
       const response = await fetch(url, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               status: !status
           })
       });

       return NextResponse.json({status: "ok", message: "Status changed"});
   }catch (e){
       return NextResponse.json({status: "error", message: "Something went wrong"});
   }




}

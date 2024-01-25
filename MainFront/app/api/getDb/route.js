import {NextResponse} from "next/server";
// export async function POST(req, res) {
//
//
//     const {username, password} = await req.body;
//     if (username === "admin" && password === "admin") {
//         return NextResponse.redirect("/dashboard");
//     } else {
//         return NextResponse.redirect("/login");
//     }
// }

export async function GET() {

    return NextResponse.json({status: "ok", message: "DB data"});

}
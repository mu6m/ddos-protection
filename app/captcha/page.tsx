import axios from "axios";
import { signAccessToken } from "@/lib/jwt";
// import prisma from "@/lib/prisma";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
	async function onSubmit(formData: FormData) {
		"use server";

		const { data } = await axios.post(
			"https://captcha-serverless.vercel.app/api/check",
			{
				code: formData.get("code"),
				token: formData.get("token"),
			}
		);
		const headersList = headers();
		const ipAddress = headersList.get("request-ip") || "127.0.0.1";

		if (!data.check) {
			throw new Error("your code is wrong");
		}
		// let ip_db = await prisma.ip.upsert({
		// 	where: {
		// 		ip: ipAddress,
		// 	},
		// 	create: {
		// 		ip: ipAddress,
		// 	},
		// 	update: { visits: { increment: 1 }, time: {} },
		// });
		// delete (ip_db as any).visits;
		//use prisma accelerate
		const date = new Date();
		date.setHours(date.getHours() + 6); //allow him 6h only
		const jwt_token = await signAccessToken({
			time: date,
		});
		//set cookie
		cookies().set("ip_token", jwt_token);
		redirect("/");
	}
	const { data } = await axios.get(
		"https://captcha-serverless.vercel.app/api/generate"
	);
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<img src={`data:image/png;base64,${data.image}`} alt="captcha" />
			<form action={onSubmit}>
				<input type="text" name="code" />
				<input type="text" name="token" value={data.token} hidden={true} />
				<button type="submit">Submit</button>
			</form>
		</main>
	);
}

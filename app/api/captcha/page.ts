import { signAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
	message: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method == "POST") {
		const response = await fetch(
			"https://captcha-serverless.vercel.app/api/check",
			{
				method: "POST",
				body: req.body,
			}
		);
		let ipAddress = req.headers["x-real-ip"] as string;

		const forwardedFor = req.headers["x-forwarded-for"] as string;
		if (!ipAddress && forwardedFor) {
			ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
		}

		if (!response.ok) {
			throw new Error("error in req");
		}
		const obj = await response.json();
		if (!obj.check) {
			throw new Error("your code is wrong");
		}
		let data = await prisma.ip.upsert({
			where: {
				ip: ipAddress,
			},
			create: {
				ip: ipAddress,
			},
			update: { visits: { increment: 1 }, time: {} },
		});
		delete (data as any).visits;
		const jwt_token = await signAccessToken(data);
		return new Response("your token is set !", {
			status: 200,
			headers: { "Set-Cookie": `ip_token=${jwt_token}` },
		});
	}
}

export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<p>
				this is home webpage is should be allowed any other page should led to{" "}
				<a href="/captcha" className="from-neutral-300 underline">
					captcha
				</a>
			</p>
		</main>
	);
}

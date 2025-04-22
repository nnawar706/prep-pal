export async function POST(req: Request) {
    const { type, role, level, techstack, amount, userid } = await req.json();

    try {
        return Response.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error("Error: " + e);

        return Response.json({
            success: false,
            error: e
        }, { status: 500 });
    }
}
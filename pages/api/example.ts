import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let statusCode = 200;

    try {
        if (req.method === "GET") {
            statusCode = 501;
            throw new Error(
                "This is just a template endpoint - modify this GET block to make it do something!"
            );
        } else {
            statusCode = 405;
            throw new Error(`${req.method} not supported for /example`);
        }
    } catch (error: any) {
        console.error(`Failed to ${req.method} example`, error.message);
        res.status(statusCode).json({ success: false, error: error.message });
    }
};

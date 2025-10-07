import type { NextApiRequest, NextApiResponse } from 'next';
import { CarData } from '../../../types/car';

export default async function handler(req: NextApiRequest, res: NextApiResponse<CarData | { message: string }>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/car/front-end/get-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: req.query.id,
                // Add any additional body parameters if needed
            }),
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

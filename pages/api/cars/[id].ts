import type { NextApiRequest, NextApiResponse } from 'next';
import { CarData } from '../../../types/car';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse<CarData | { message: string }>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Force IPv4 by using 127.0.0.1 instead of localhost
        const baseUrl = process.env.API_URL?.replace('localhost', '127.0.0.1');
        const apiUrl = `${baseUrl}/car/front-end/get-data`;
        console.log('Making request to:', apiUrl);

        const response = await axios.post(
            apiUrl,
            {
                id: req.query.id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add axios specific IPv4 configuration
                proxy: false,
                family: 4,
            },
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Detailed API Error:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            config: error.config,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

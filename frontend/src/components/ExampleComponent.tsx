import React, { useEffect, useState } from 'react';
import { fetchMessage } from '../services/api';

const ExampleComponent: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMessage = async () => {
            try {
                const msg = await fetchMessage();
                setMessage(msg);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        getMessage();
    }, []);

    return (
        <div>
            <h2>Message from Backend</h2>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
};

export default ExampleComponent;

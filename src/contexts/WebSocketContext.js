import React, { createContext, useContext, useEffect, useRef } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const wsRef = useRef(null);
    const handlersRef = useRef(new Map());

    const connect = (videoId) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket(`ws://localhost:5000?videoId=${videoId}`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const handlers = handlersRef.current.get(data.type) || [];
                handlers.forEach(handler => handler(data));
            } catch (err) {
                console.error('Error handling WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        wsRef.current = ws;
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    };

    const disconnect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }
    };

    const subscribe = (type, handler) => {
        if (!handlersRef.current.has(type)) {
            handlersRef.current.set(type, []);
        }
        handlersRef.current.get(type).push(handler);

        return () => {
            const handlers = handlersRef.current.get(type);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        };
    };

    const send = (data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ connect, disconnect, subscribe, send }}>
            {children}
        </WebSocketContext.Provider>
    );
}; 
import { Response } from 'express';

export const mockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn(() => res as Response);
    res.end = jest.fn(() => res as Response);
    res.json = jest.fn(() => res as Response);
    return res;
};

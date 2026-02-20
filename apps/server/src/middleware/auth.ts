import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase.config';

// Extend the Express Request to include our user payload
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
    };
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // Verify the ID token using the Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        // Attach the decoded token payload to the request for downstream use
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture
        };

        next();
    } catch (error) {
        console.error('[Auth Middleware] Invalid token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

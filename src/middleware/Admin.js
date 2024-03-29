// isAdmin middleware function
const isAdmin = (req, res, next) => {
    try {
        // Check if user is authenticated and has the admin role
        if (req.user && req.user.role === 'admin') {
            // User is an admin, proceed to the next middleware
            next();
        } else {
            // User is not admin, forbid access
            return res.status(403).send({ error: 'Unauthorized access' });
        }
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = isAdmin;

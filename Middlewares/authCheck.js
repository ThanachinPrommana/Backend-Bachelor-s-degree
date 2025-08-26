const jwt = require('jsonwebtoken');

// middleware ตรวจสอบ token และสิทธิ์ role
exports.authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


exports.isAuthenticated = (req, res, next) => { 
    
    if (!req.session) {
        console.log("CRITICAL FAILURE: req.session object does NOT exist.");
        console.log("-------------------------------------------\n");
        return res.status(500).json({ message: 'Session middleware is not configured correctly.' });
    }
    
    if (req.session && req.session.user) {
        console.log("SUCCESS: User found in session. Proceeding...");
        console.log("-------------------------------------------\n");
        return next();
    } else {
        console.log("FAILURE: User NOT found in session. Sending 401.");
        console.log("-------------------------------------------\n");
        res.status(401).json({ message: 'You are not logged in' });
    }
};


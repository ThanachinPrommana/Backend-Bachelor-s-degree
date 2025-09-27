import prisma from "../config/prisma.js";

export const getAvailableSlotsForPost = async (req, res) => {
    try {
        // 1. Get postId from the URL parameters
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // 2. Find all slots that match the postId and are not booked
        const slots = await prisma.dateTimeSlot.findMany({
            where: {
                postId: postId,      // Filter by the specific post
                isBooked: false,   // Only show available slots
            },
            orderBy: {
                startTime: 'asc', // Sort the results by start time
            }
        });

        // 3. Send the available slots back to the client
        res.status(200).json(slots);

    } catch (err) {
        console.error("Error fetching available slots:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
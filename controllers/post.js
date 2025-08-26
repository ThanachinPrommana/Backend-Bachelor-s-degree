const prisma = require("../config/prisma");
const { connect } = require("../routers/user");
const cloudinary = require("../utils/cloudinary");

exports.createpost = async (req, res) => {
    try {
        const {
            Property_Name,
            Price,
            Usable_Area,
            Land_Size,
            Bedrooms,
            Description,
            Deposit_Amount,
            Contract_Seller,
            LinkMap,
            Latitude,
            Longitude,
            Province,
            District,
            Subdistrict,
            Address,
            Total_Rooms,
            Year_Built,
            Nearby_Landmarks,
            Additional_Amenities,
            Parking_Space,
            Sell_Rent,
            Link_line,
            Link_facbook,
            Name,
            Phone,
            Bathroom,
            Propertytype,
            Other_related_expenses,
            categoryId,
            Interest,
        } = req.body

        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized, please login first" });
        }

        const userId = req.session.user.id;
        const files = req.files;

        const nearbyLandmarksArray = Array.isArray(Nearby_Landmarks)
            ? Nearby_Landmarks
            : (Nearby_Landmarks ? [Nearby_Landmarks] : []);

        const additionalAmenitiesArray = Array.isArray(Additional_Amenities)
            ? Additional_Amenities
            : (Additional_Amenities ? [Additional_Amenities] : []);

        const newPost = await prisma.propertyPost.create({

            data: {
                Property_Name,
                Province,
                District,
                Subdistrict,
                Address,
                Propertytype,
                Usable_Area: parseFloat(Usable_Area),
                Total_Rooms: parseInt(Total_Rooms),
                Year_Built,
                Nearby_Landmarks: nearbyLandmarksArray,
                Land_Size: parseFloat(Land_Size),
                Bedrooms: parseInt(Bedrooms),
                Bathroom: parseInt(Bathroom),
                Description,
                Deposit_Amount: parseFloat(Deposit_Amount),
                Contract_Seller,
                LinkMap,
                Price: parseFloat(Price),
                Additional_Amenities: additionalAmenitiesArray,
                Parking_Space: parseInt(Parking_Space),
                Sell_Rent: Sell_Rent,
                Link_line,
                Link_facbook,
                Name,
                Phone,
                Latitude: parseFloat(Latitude),
                Longitude: parseFloat(Longitude),
                Other_related_expenses,
                Interest: parseFloat(Interest),
                Category: {
                    connect: {
                        id: categoryId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
                Image: {
                    create: files.map((file) => ({
                        asset_id: file.asset_id,
                        public_id: file.public_id,
                        url: file.path || file.url,
                        secure_url: file.secure_url || file.path
                    }))
                }
            }, include: {
                Image: true,
            }
        })
        res.status(201).json(newPost)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.list = async (req, res) => {
    try {

    } catch (err) {

    }
}
exports.handlePrice = async (req, res, price) => {

}
const handlecategory = async (req, res, categoryId) => {
    try {
        const ids = Array.isArray(categoryId) ? categoryId : [categoryId]
        const products = await prisma.propertyPost.findMany({
            where: {
                categoryId: {
                    in: ids
                }
            }, include: {
                Image: true,
                Category: true
            }
        })
        res.json({
            products
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.handleSellerRent = async (req, res) => {

}
// exports.searchFilters = async (req, res) => {
//     try {
//         const { query } = req.body
//         if (!query) {
//             return res.status(400).json({
//                 message: "No search query provided"
//             })
//         }
//         const posts = await prisma.propertyPost.findMany({
//             where: {
//                 OR: [
//                     {
//                         Property_Name: {
//                             contains: query,
//                             mode: "insensitive"
//                         }
//                     },
//                     {
//                         Province:{
//                             contains:query,
//                             mode:"insensitive"
//                         }
//                     },
//                     {
//                         District:{
//                             contains:query,
//                             mode:"insensitive"
//                         }
//                     },
//                     {
//                         Subdistrict:{
//                             contains:query,
//                             mode:"insensitive"
//                         }
//                     },
//                     {
//                         Address:{
//                             contains:query,
//                             mode:"insensitive"
//                         }
//                     },
//                     {
//                         Description:{
//                             contains:query,
//                             mode:"insensitive"
//                         }
//                     },
//                     {
//                         Bedrooms:
//                     }
//                 ]
//             }
//         })
//     } catch (err) {

//     }
// }
const handleQuery = async (req, res, query) => {
    try {
        const post = await prisma.propertyPost.findMany({
            where: {
                OR: [
                    {
                        Property_Name: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        Year_Built: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        Description: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        Address: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }

                ]
            },
            include: {
                Category: true,
                Image: true
            }
        });
        res.json({ post });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.searchFilters = async (req, res) => {
    try {
        const { query, categoryId } = req.body;
        if (query) {
            console.log("query--->", query);
            await handleQuery(req, res, query); // เรียกผ่าน exports
        }
        if (categoryId) {
            console.log("categoryId--->", categoryId);
            await handlecategory(req, res, categoryId)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getbycategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const properties = await prisma.propertyPost.findMany({
            where: {
                categoryId
            },
            include: {
                Image: true,
                Category: true,
                user: true
            }
        })
        res.json(properties)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.getPost = async (req, res) => {
    try {
        const { id } = req.params
        const images = await prisma.image.findMany({
            where: { id }
        });
        console.log(images);
        const post = await prisma.propertyPost.findUnique({
            where: {
                id
            },
            select: {
                Property_Name: true,
                Province: true,
                Deposit: true,
                District: true,
                Subdistrict: true,
                Address: true,
                Category: true,
                Usable_Area: true,
                Total_Rooms: true,
                Year_Built: true,
                Nearby_Landmarks: true,
                Image: {
                    select: {
                        url: true,
                        secure_url: true
                    }
                },
                userId: true,
                Land_Size: true,
                Bedrooms: true,
                Bathroom: true,
                Description: true,
                Deposit_Amount: true,
                LinkMap: true,
                Price: true,
                Additional_Amenities: true,
                Parking_Space: true,
                Sell_Rent: true,
                user: {
                    select: {
                        First_name: true,
                        Last_name: true
                    }
                },
                Phone: true,
                Latitude: true,
                Longitude: true,
                Other_related_expenses: true,
                Category: true,
                Status_post: true,

            }

        })
        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.removepost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.propertyPost.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const images = await prisma.image.findMany({
            where: { propertyPostId: id },
        });


        // for (const image of images) {
        //     if (image.public_id) {
        //         await cloudinary.uploader.destroy(image.public_id);
        //     }
        // }

        const deleteImagePromises = images.map(img => {
            if (img.public_id) {
                return cloudinary.uploader.destroy(img.public_id)
            }
        })
        await Promise.all(deleteImagePromises)

        await prisma.deposit.deleteMany({
            where: { postId: id },
        });


        await prisma.image.deleteMany({
            where: { propertyPostId: id },
        });


        const deletedPost = await prisma.propertyPost.delete({
            where: { id },
        });


        res.json({
            message: "Post and related data deleted successfully",
            deletedPost,
            deletedImages: images,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ message: "Invalid or missing request body" });
        }

        // ดึง post เดิมมาก่อน
        const existingPost = await prisma.propertyPost.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const allowedFields = [
            "Property_Name", "Price", "Usable_Area", "Land_Size", "Bedrooms", "Description",
            "Deposit_Amount", "Contract_Seller", "LinkMap", "Latitude", "Longitude",
            "Province", "District", "Subdistrict", "Address", "Total_Rooms", "Year_Built",
            "Nearby_Landmarks", "Additional_Amenities", "Parking_Space", "Sell_Rent",
            "Link_line", "Link_facbook", "Name", "Phone", "Bathroom", "Propertytype",
            "Other_related_expenses", "categoryId"
        ];

        const dataToUpdate = {};

        for (const field of allowedFields) {
            const incomingValue = req.body[field];

            if (incomingValue === undefined || incomingValue === null || incomingValue === "") {
                dataToUpdate[field] = existingPost[field];
            } else {
                dataToUpdate[field] = incomingValue;
            }
        }

        const updatedPost = await prisma.propertyPost.update({
            where: { id },
            data: dataToUpdate,
        });


        let updateImage = null;
        if (req.files && req.files.length > 0) {
            await prisma.image.deleteMany({
                where: { propertyPostId: id },
            });

            const imageData = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
                propertyPostId: id,
            }));

            updateImage = await prisma.image.createMany({
                data: imageData,
            });
        }

        res.json({ message: "Post updated successfully", post: updatedPost, image: updateImage });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


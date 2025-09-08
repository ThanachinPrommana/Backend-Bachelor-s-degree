const prisma = require("../config/prisma")
exports.create = async (req, res) => {
    try {
        const { name } = req.body
        const category = await prisma.category.create({
            data: {
                name: name.toLowerCase(),
            }
        })
        res.send(category)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.list = async (req, res) => {
    try {
        const category = await prisma.category.findMany()
        
        res.json(category)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true }, // พอสำหรับแสดงผล
    });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.removecategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        await prisma.category.delete({
            where: { id: id }, // string ใช้ตรง ๆ
        });

        res.status(200).json({ message: "Delete Success" });
    } catch (err) {
        console.error(err);

        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(500).json({ message: "Server Error" });
    }
};

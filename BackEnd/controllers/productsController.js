import OrderItem from "../models/Product.js";

export const addProduct = async (req, res) => {
    try {
        const itemData = req.body;
        const newOrderItem = new OrderItem(itemData);

        const savedItem = await newOrderItem.save();

        // 3. Send a success response
        return res.status(201).json({
            message: "Order item added successfully!",
            item: savedItem,
        });

    } catch (error) {
        console.log(error,'error')
    }
};




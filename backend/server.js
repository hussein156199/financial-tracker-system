import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const port = 3001;

app.use(express.json());
app.use(cors());

// Clear all data
app.delete('/clear', async (req, res) => {
  try {
    // Delete all items
    await prisma.item.deleteMany();
    
    // Reset user info
    await prisma.userinfo.updateMany({
      data: {
        total_budget: 0,
        payments: 0,
        remaining_budget: 0
      }
    });

    res.status(200).json({ message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

//get All items
app.get("/items", async (req, res) => {
    try {
        const items = await prisma.item.findMany();

        if (!items) {
            return res.status(404).json({ error: "No items found" });
        }

        res.status(200).json(items);

    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

//get Items with category
app.get('/items/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        const items = await prisma.item.findMany({
            where: {
                category: category,
            },
        });

        if (!items || items.length === 0) {
            return res.status(404).json({ error: "No items found in this category" });
        }

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items by category:", error);
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

//get user info
app.get('/userinfo', async (req, res) => {
    try {
        const userinfo = await prisma.Userinfo.findFirst({})

        if(!userinfo) {
            return res.status(404).json({ error: "User info not found" });
        }

        res.status(200).json(userinfo);
    } catch(error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Failed to fetch user info" });
    }
})

//set budget
app.patch('/userinfo/budget', async (req, res) => {
    try {
        // Get the budget from request body
        const budgetAmount = req.body.budget;

        // Validate budget
        if (typeof budgetAmount !== 'number') {
            return res.status(400).json({ error: "Valid budget amount is required" });
        }

        // Find existing user info
        const existingUser = await prisma.Userinfo.findFirst({});
        if (!existingUser) {
            return res.status(404).json({ error: "User info not found" });
        }

        // Calculate new budget
        const newBudget = existingUser.total_budget + budgetAmount;

        // Validate new budget
        if (newBudget < 0) {
            return res.status(400).json({ error: "Budget cannot be negative" });
        }

        // Update user info
        const result = await prisma.Userinfo.update({
            where: { id: existingUser.id },
            data: {
                total_budget: newBudget,
                remaining_budget: newBudget - existingUser.payments
            }
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.status(500).json({ error: "Failed to update budget" });
    }
});

//add item
app.post('/items', async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        // Validate input
        if (!name || !category || typeof price !== 'number' || typeof quantity !== 'number') {
            return res.status(400).json({ error: "Name, category, quantity, and valid price are required" });
        }

        // Get user info first to check budget
        const userinfo = await prisma.Userinfo.findFirst({});
        if (!userinfo) {
            return res.status(404).json({ error: "User info not found" });
        }

        // Calculate total price
        const totalPrice = price * quantity;

        // Check if user has enough remaining budget
        if (userinfo.remaining_budget < totalPrice) {
            return res.status(400).json({ error: "Insufficient budget" });
        }

        // Create new item
        const newItem = await prisma.item.create({
            data: {
                name,
                category,
                price,
                quantity,
            },
        });

        // Update user info with new item price
        await prisma.Userinfo.update({
            where: { id: userinfo.id },
            data: {
                remaining_budget: userinfo.remaining_budget - totalPrice,
                payments: userinfo.payments + totalPrice
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Failed to add item" });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

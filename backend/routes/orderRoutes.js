const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// GET single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

// POST create order
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      district,
      address,
      email,
      note,
      paymentMethod,
      bkashLast3Digits,
      transactionId,
      cartItems,
      subTotal,
      shipping,
      total,
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !district ||
      !address ||
      !email ||
      !bkashLast3Digits ||
      !transactionId ||
      !cartItems ||
      !cartItems.length ||
      subTotal === undefined ||
      shipping === undefined ||
      total === undefined
    ) {
      return res.status(400).json({ message: "Please fill all required order fields" });
    }

    // 1) আগে stock check করো
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} এর পর্যাপ্ত stock নেই। Available stock: ${product.stock}`,
        });
      }
    }

    // 2) stock deduct করো
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      product.stock = product.stock - item.quantity;
      await product.save();
    }

    // 3) order save করো
    const order = new Order({
      customerName: customerName.trim(),
      phone: phone.trim(),
      district: district.trim(),
      address: address.trim(),
      email: email.trim(),
      note: note ? note.trim() : "",
      paymentMethod: paymentMethod || "bkash",
      bkashLast3Digits: bkashLast3Digits.trim(),
      transactionId: transactionId.trim(),
      cartItems,
      subTotal,
      shipping,
      total,
      paymentStatus: "submitted",
      orderStatus: "pending",
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully and stock updated",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// PUT order status update
router.put("/:id/status", async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.orderStatus;

    // 1) pending -> cancelled হলে stock add back হবে
    if (previousStatus === "pending" && orderStatus === "cancelled") {
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);

        if (product) {
          product.stock = product.stock + item.quantity;
          await product.save();
        }
      }
    }

    // 2) cancelled -> pending আবার allow করবো না, কারণ এতে stock logic জটিল হবে
    if (previousStatus === "cancelled" && orderStatus === "pending") {
      return res.status(400).json({
        message: "Cancelled order cannot be moved back to pending",
      });
    }

    // 3) cancelled -> delivered allow করবো না
    if (previousStatus === "cancelled" && orderStatus === "delivered") {
      return res.status(400).json({
        message: "Cancelled order cannot be marked as delivered",
      });
    }

    // 4) delivered -> cancelled allow করবো না
    if (previousStatus === "delivered" && orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
});

module.exports = router;
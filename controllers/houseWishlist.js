const HouseWishlist = require("../models/HouseWishlist");
const House = require("../models/House");
const Customer = require("../models/Customer");

// @desc    Get house wishlist for customer
exports.getHouseWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;

    const wishlist = await HouseWishlist.findOne({ customerId }).populate({
      path: 'houses',
      model: 'houses'
    });

    if (!wishlist) {
      return res.status(200).json({ houses: [] });
    }

    res.status(200).json({ houses: wishlist.houses });
  } catch (error) {
    console.error("Ошибка при получении wishlist:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// @desc    Add house to wishlist
exports.addHouseToWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;
    const houseId = req.params.houseId;

    // Check if house exists
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "Дом не найден" });
    }

    // Find or create wishlist
    let wishlist = await HouseWishlist.findOne({ customerId });

    if (!wishlist) {
      wishlist = new HouseWishlist({ customerId, houses: [houseId] });
    } else {
      // Check if house is already in wishlist
      if (wishlist.houses.includes(houseId)) {
        return res.status(400).json({ message: "Дом уже в списке избранных" });
      }
      wishlist.houses.push(houseId);
    }

    await wishlist.save();

    // Return updated wishlist with populated houses
    const updatedWishlist = await HouseWishlist.findOne({ customerId }).populate({
      path: 'houses',
      model: 'houses'
    });

    res.status(200).json({
      message: "Дом добавлен в избранное",
      houses: updatedWishlist.houses
    });
  } catch (error) {
    console.error("Ошибка при добавлении дома в wishlist:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// @desc    Remove house from wishlist
exports.removeHouseFromWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;
    const houseId = req.params.houseId;

    const wishlist = await HouseWishlist.findOne({ customerId });

    if (!wishlist) {
      return res.status(404).json({ message: "Список избранных не найден" });
    }

    // Remove house from wishlist
    wishlist.houses = wishlist.houses.filter(house => house.toString() !== houseId);
    await wishlist.save();

    // Return updated wishlist with populated houses
    const updatedWishlist = await HouseWishlist.findOne({ customerId }).populate({
      path: 'houses',
      model: 'houses'
    });

    res.status(200).json({
      message: "Дом удален из избранного",
      houses: updatedWishlist ? updatedWishlist.houses : []
    });
  } catch (error) {
    console.error("Ошибка при удалении дома из wishlist:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// @desc    Clear entire house wishlist
exports.clearHouseWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;

    await HouseWishlist.findOneAndDelete({ customerId });

    res.status(200).json({
      message: "Список избранных очищен",
      houses: []
    });
  } catch (error) {
    console.error("Ошибка при очистке wishlist:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// @desc    Check if house is in wishlist
exports.isHouseInWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;
    const houseId = req.params.houseId;

    const wishlist = await HouseWishlist.findOne({ customerId });

    const isInWishlist = wishlist ? wishlist.houses.includes(houseId) : false;

    res.status(200).json({ isInWishlist });
  } catch (error) {
    console.error("Ошибка при проверке дома в wishlist:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
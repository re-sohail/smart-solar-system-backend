const User = require("../models/user.model");

// User List
const userList = async (req, res) => {
  // Extract query parameters for search, filtering, pagination, and sort.
  const { search, role, status, page = 1, limit = 10, sort } = req.query;

  // Build the dynamic query object.
  const query = {};

  // Add search criteria across firstName, lastName, email, and mobileNo fields.
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive regex.
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { mobileNo: searchRegex },
    ];
  }

  // Apply role filter if provided.
  if (role) {
    query.role = role;
  }

  // Apply status filter if provided.
  if (status) {
    query.status = status;
  }

  // Calculate pagination values.
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Build sort options.
  let sortOptions = {};
  if (sort) {
    // Supports sort values like 'email' or '-email' (descending order).
    const sortField = sort.replace(/^-/, "");
    sortOptions[sortField] = sort.startsWith("-") ? -1 : 1;
  } else {
    // Default sort by created date descending.
    sortOptions = { createdAt: -1 };
  }

  // Get the total record count for pagination meta.
  const totalRecords = await User.countDocuments(query);

  // Query the database with the dynamic query, sorting, pagination, and exclude password.
  // also exclude admin user
  const users = await User.find(query && { role: { $ne: "admin" } })
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .select("-password");

  // Send the response including meta information.
  res.sendSuccess({
    message: "User List",
    data: users,
    meta: {
      totalRecords,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalRecords / limitNumber),
    },
  });
};

// Approve User Account or reject
const approveUser = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  console.log("userId", status);

  // Find the user by ID and update the isApproved field.
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, select: "-password" }
  );

  // Send the response.
  res.sendSuccess({
    message: "User Account Approved",
    data: user,
  });
};

module.exports = {
  userList,
  approveUser,
};

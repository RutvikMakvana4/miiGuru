import User from "../models/users";

const data = [
  {
    email: "admin@gmail.com",
    password: "$2a$12$8x9qp5ltX0cB.bE4i8zj7..B3.T5mbFtxxqolSHnrVEw9xwKyUzy6", //admin
    isAdmin: true
  },
];

async function adminLoginData() {
  try {
    const findAdmin = await User.findOne({ isAdmin: true });
    if (!findAdmin) {
      await User.insertMany(data);
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

adminLoginData();
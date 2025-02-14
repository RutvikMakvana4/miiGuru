module.exports = {
    JWT: {
        SECRET: process.env.SECRETKEY,
        EXPIRES_IN: "1 YEAR"
    },
    BCRYPT: {
        SALT_ROUND: 12
    },

    URL: {
        FRONTEND: `https://mii-guru-frontend.vercel.app`
    }
};
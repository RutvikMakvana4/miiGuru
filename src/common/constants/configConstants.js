module.exports = {
  baseUrl(path = null) {
    let url = process.env.RENDER_EXTERNAL_URL || `http://${process.env.HOST}:${process.env.PORT}`;
    return url + (path ? `/${path}` : "");
  },

  apiBaseUrl(path = null) {
    let url = process.env.RENDER_EXTERNAL_URL
      ? `${process.env.RENDER_EXTERNAL_URL}/api/v1`
      : `http://${process.env.HOST}:${process.env.PORT}/api/v1`;

    return url + (path ? `/${path}` : "");
  },
};
const getIp = () => {
  const ip = sessionStorage.getItem("ipAddress");
  return ip;
};

const path = {
  // host: "https://api.jamamasjidgumla.com/wp/wp-json",
  host: `http://${getIp()}:1337/api`,
  hostOnly: `http://${getIp()}:1337`,
  // host: "http://192.168.29.202:8800",
  ui: {
    root: "/",
    voters: "/voters",
    panchayats: "/panchayat",
    printVoterId: "/printVoterId",
    elections: "/elections",
    imageGallery: "/imageGallery",
    settings: "/settings",
  },
  api: {
    auth: {
      root: "/auth",
      login: "/local",
      logout: "/token/revoke",
    },
    voters: {
      root: "/voters",
    },
    panchayats: {
      root: "/panchayats",
    },
    elections: {
      root: "/elections",
    },
  },
};

export default path;

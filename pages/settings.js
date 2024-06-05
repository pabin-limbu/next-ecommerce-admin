import axios from "axios";
import React, { useEffect, useState } from "react";

function Settings() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios.get("/api/user").then((res) => {
      console.log(res.data);
    });
  }, []);

  return <div>view admin</div>;
}

export default Settings;

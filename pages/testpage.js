import axios from "axios";
import React from "react";

function testpage() {
  function testApi() {
    console.log("clicked");
    axios.get("/api/test").then((res) => {
      console.log("hi");
    });
  }

  return (
    <div>
      <p>this is a test page</p>
      <button onClick={testApi}>Click me</button>
    </div>
  );
}

export default testpage;

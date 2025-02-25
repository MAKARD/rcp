import axios from "axios";

(async () => {
    const {data} = await axios.post("http://localhost:3000/session");

    console.log("Session id", data.id);
})();

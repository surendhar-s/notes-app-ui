import decode from 'jwt-decode';
import axios from 'axios';

class AuthHetperMethods {
    // constructor(domain) {
    //     this.domain = domain
    // }
    login = async (email, password) => {
        // const data = await this.fetch('/login', {
        //     method: "POST",
        //     body: JSON.stringify({
        //         email,
        //         password
        //     })
        // });
        const data = await axios.post("http://localhost:3200/api/users/login", {
            email,
            password
        })
        // let decodedData= decode(data.data.message.token)
        // console.log(data.data.message)
        if (data.data.message.success) {
            this.setToken(data.data.message.token);
        }
        return Promise.resolve(data.data.message.success);
    }

    loggedIn = () => {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            console.log("expired check failed! Line 42: AuthService.js");
            return false;
        }
    };

    setToken = idToken => {
        localStorage.setItem("id_token", idToken);
    };

    getToken = () => {
        return localStorage.getItem("id_token");
    };

    logout = () => {
        localStorage.removeItem("id_token");
    };

    getConfirm = () => {
        let answer = decode(this.getToken());
        // console.log("Recieved answer!");
        return answer;
    };

    // fetch = (url, options) => {
    //     const headers = {
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //     };
    //     if (this.loggedIn()) {
    //         headers["Authorization"] = "Bearer " + this.getToken();
    //     }

    //     return fetch(url, {
    //         headers,
    //         ...options
    //     })
    //         .then(this._checkStatus)
    //         .then(response => response.json());
    // };

    // _checkStatus = response => {
    //     if (response.status >= 200 && response.status < 300) {
    //         return response;
    //     } else {
    //         var error = new Error(response.statusText);
    //         error.response = response;
    //         throw error;
    //     }
    // };
}

export default AuthHetperMethods;
const axios = require("axios");

class AxiosS {

    constructor() {
        this.axios = axios.create({
            baseURL: "https://movie-quote-api.herokuapp.com/v1"
        })
    }

    getShows() {
        return this.axios.get("/shows").then((res) => res.data)
    }

    getQuote(slug) {
        return this.axios.get(`/shows/${slug}`).then((res) => res.data)
    }

}


module.exports = AxiosS;
import Axios from 'axios';

const uri = "http://localhost:5000"

export const apiCall = {
    get: (path) => {
        const url = `${uri}${path}`
        return Axios.get(url)
    }
}
import axios from 'axios'
import {message} from 'ant-design-vue'

const instance = axios.create({baseURL: process.env.VUE_APP_BASE_URL})
instance.interceptors.response.use((result) => {
    if (!result.data.success) {
        message.error(result.data.message)
        return Promise.reject(result.data)
    }
    return Promise.resolve(result.data)
}, (reason) => {
    return Promise.reject(reason)
})

export default instance
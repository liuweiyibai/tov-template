import Axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import { notification } from 'ant-design-vue'
import { useUserStore } from '~/stores/userStore'

let isLogoutIng = false

const _timeout = 120000

const errorHandler = (error: AxiosError) => {
	const userStore = useUserStore()
	if (error.response) {
		const data: any = error.response.data
		// const token = userStore.token
		if (error.response.status === 404) {
			notification.error({
				message: 'NotFound',
				description: data.msg || error.response.statusText,
			})
		}

		if (error.response.status === 406) {
			const text = data?.data || {}
			notification.error({
				message: '错误参数格式',
				description: JSON.stringify(text),
			})
		}

		if (error.response.status === 400 || error.response.status === 500) {
			notification.error({
				message: '系统错误',
				description: data.msg || error.response.statusText,
			})
		}

		if (error.response.status === 403) {
			notification.error({
				message: 'Forbidden',
				description: data.msg || error.response.statusText,
			})
		}

		if (error.response.status === 401) {
			if (isLogoutIng) {
				return
			}
			isLogoutIng = true
			notification.error({
				message: '登录过期',
				description: data.msg || error.response.statusText,
			})
			// userStore.logout().then(() => {
			// 	window.location.reload()
			// })
		}
	}
	return Promise.reject(error)
}

const getErrorCode2text = (response: AxiosResponse): string => {
	/** http status code */
	const code = response.status
	/** notice text */
	let message = 'Request Error'
	switch (code) {
		case 400:
			message = 'Request Error'
			break
		case 401:
			message = 'Unauthorized, please login'
			break
		case 403:
			message = '拒绝访问'
			break
		case 404:
			message = '访问资源不存在'
			break
		case 408:
			message = '请求超时'
			break
		case 500:
			message = '位置错误'
			break
		case 501:
			message = '承载服务未实现'
			break
		case 502:
			message = '网关错误'
			break
		case 503:
			message = '服务暂不可用'
			break
		case 504:
			message = '网关超时'
			break
		case 505:
			message = '暂不支持的 HTTP 版本'
			break
		default:
			message = '位置错误'
	}
	return message
}

const axiosInstance = Axios.create({
	baseURL: '/api',
	timeout: _timeout,
	responseType: 'json',
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
		clientId: 'saas_hr',
	},
})

const downFile = Axios.create({
	baseURL: '/api',
	withCredentials: false,
	responseType: 'blob',
	headers: {
		'Content-Type': 'application/json',
		clientId: 'saas_hr',
	},
})

axiosInstance.interceptors.request.use((config: any) => {
	const userStore = useUserStore()
	if (!config.url?.includes('auth')) {
		config.headers['Authorization-web'] = [userStore.token]
	}

	return config
})

export const downloader = async (
	url: string,
	resOpts: AxiosRequestConfig,
): Promise<AxiosResponse<any>> => {
	const { method = 'get', data = '', ...args } = resOpts
	const userStore = useUserStore()
	const queryArgs: any = {
		url,
		method,
		data,
		headers: {
			['Authorization-web']: userStore.token,
		},
		...args,
	}
	return downFile.request(queryArgs)
}

/**
 * @description 响应收到后的拦截器
 * @returns {}
 */
axiosInstance.interceptors.response.use((response: AxiosResponse) => {
	if (response.status === 200) {
		return Promise.resolve(response.data)
	} else {
		const __text = getErrorCode2text(response)
		return Promise.reject(new Error(__text))
	}
}, errorHandler)

const service = <T>({
	url,
	method = 'get',
	params,
	data,
	timeout = _timeout,
	...args
}: AxiosRequestConfig) =>
	axiosInstance.request<unknown, T>({
		url,
		method,
		params,
		data,
		timeout,
		...args,
	})

export function getHeaders() {
	const userStore = useUserStore()
	return {
		clientId: 'saas_hr',
		'Authorization-web': userStore.token,
	}
}

export function onAction(append = '') {
	return `/api${append}`
}

export default service

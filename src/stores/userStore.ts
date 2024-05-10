import { defineStore } from 'pinia'
import { getItem } from '~/utils/storage'

export const APP_TOKEN = 'APP_TOKEN'

const token: any = (async () => {
	return await getItem(APP_TOKEN)
})()

export const useUserStore = defineStore('UserStore', {
	state: () => ({
		token,
	}),

	actions: {
		setToken(value: string | undefined) {
			this.token = value!
		},
	},
})


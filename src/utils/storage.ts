import localforage from 'localforage'

export const getItem = async (key: string):Promise<any> => {
	try {
		return await localforage.getItem(key)
	} catch (error) {
		return false
	}
}
export const setItem = async (key: string,it:any) => {
	try {
		return await localforage.setItem(key,it)
	} catch (error) {
		return false
	}
}

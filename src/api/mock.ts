

import { ApiResponse } from '@/types/axios';
import axios from '~/utils/axios';


class MockService {

	static mockGet<T = any>() {
		return axios<ApiResponse<T>>({
			url: '/mock/get',
			method: 'get',
		})
	}
}

export default MockService

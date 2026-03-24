export const thousandSeperate = (data = '') => {
	return data
		.toString()
		.replace(/\s/g, '')
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const roundPrice = (price, duration) => {
	return Math.ceil(price / duration / 1000) * 1000
}

export const isActive = ({
	store,
	localStore,
	product
}) => {
	if (store) {
		return store.items.some((item) => item.id === product.id) ? 1 : 0
	} else if (localStore) {
		return localStore.items.some((item) => item.id === product.id) ? 1 : 0
	} else {
		return 0
	}
}

export const removeQueryParam = ({
	param,
	router
}) => {
	const {
		pathname,
		query
	} = router
	const params = new URLSearchParams(query)
	params.delete(param)
	router.replace({
		pathname,
		query: params.toString()
	}, undefined, {
		shallow: true,
	})
}

export const addQueryParam = ({
	key,
	value,
	router
}) => {
	const {
		pathname,
		query
	} = router
	const params = new URLSearchParams(query)
	params.append(key, value)
	router.replace({
		pathname,
		query: params.toString()
	}, undefined, {
		shallow: true,
	})
}

export const updateQueryParam = ({
	key,
	value,
	router
}) => {
	const {
		query
	} = router
	router.push({
		query: {
			...query,
			[key]: value
		}
	}, undefined, {
		shallow: true,
	})
}


export const formatDateTime = (dateString) => {
	if (!dateString) return "";

	const date = new Date(dateString);

	// Kun, oy va yilni olish
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlangani uchun +1
	const year = date.getFullYear();

	// Soat va minutni olish
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const parseSizeToMB = (sizeStr) => {
	if (!sizeStr || typeof sizeStr !== 'string') return 0;

	const value = parseFloat(sizeStr);
	const unit = sizeStr.replace(/[0-9. ]/g, "").toUpperCase();

	switch (unit) {
		case "GB":
			return value * 1024;
		case "MB":
			return value;
		case "KB":
			return value / 1024;
		case "B":
			return value / (1024 * 1024);
		default:
			return value;
	}
};
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
	if (isNaN(date.getTime())) return "";

	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');

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


export const formatDate = (dateStr) => {
	if (!dateStr) return {
		full: "---",
		time: "--:--"
	};
	const date = new Date(dateStr);
	return {
		full: date.toLocaleDateString("uz-UZ", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}),
		time: date.toLocaleTimeString("uz-UZ", {
			hour: "2-digit",
			minute: "2-digit",
		}),
	};
};
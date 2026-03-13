import { configureStore } from '@reduxjs/toolkit';
import paginationReducer from '../slice/pagination';
import authReducer from '../slice/auth';

const store = configureStore({
    reducer: {
        pagination: paginationReducer,
        auth: authReducer,
    },
});

export default store;
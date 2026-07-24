import { client } from "./helper.js";

export const fetchRooms = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams(queryObject).toString();

        const { data } = await client.get(`/room-type${query ? `?${query}` : ""}`);

        return {
            success: data.success,
            data: data.rooms,
            message: data.message,
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Internal Server Error",
        };
    }
};

export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);

        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        };
    }
};

export const fetchCategory = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        // Forward any filters the caller passes (e.g. { status: true })
        if (queryObject.status !== undefined) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);

        const response = await client.get(`category${query.toString() ? `?${query.toString()}` : ""}`);

        return {
            success: response.data.success,
            data: response.data.categories,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        };
    }
};

export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);

        return {
            success: response.data.success,
            data: response.data.category,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        };
    }
};

export const fetchProduct = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        if (queryObject.status) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);
        if (queryObject.bestSeller) query.append("bestSeller", queryObject.bestSeller);
        if (queryObject.room) query.append("room", queryObject.room);
        if (queryObject.category) query.append("category", queryObject.category);
        if (queryObject.min && queryObject.max) {
            query.append("min", queryObject.min);
            query.append("max", queryObject.max);
        }
        if (queryObject.sort) query.append("sort", queryObject.sort);

        const response = await client.get(`product?${query.toString()}`);

        return {
            success: response.data.success,
            data: response.data.products,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        };
    }
};

export const fetchProductById = async (id) => {
    try {
        const { data } = await client.get(`/product/${id}`);

        return {
            success: data.success,
            product: data.product,
            message: data.message,
        };
    } catch (error) {
        return {
            success: false,
            product: null,
            message: error?.response?.data?.message || "Internal Server Error",
        };
    }
};

// ─────────────────────────────────────────
// Address APIs
// ─────────────────────────────────────────

export const fetchAddresses = async () => {
    try {
        const { data } = await client.get("address");
        return { success: data.success, data: data.data, message: data.message };
    } catch (error) {
        const msg = error.response?.data?.message || error.friendlyMessage || "Internal Server Error";
        return { success: false, data: [], message: msg };
    }
};

export const createAddress = async (payload) => {
    try {
        const { data } = await client.post("address/create", payload);
        return { success: data.success, data: data.address, message: data.message };
    } catch (error) {
        const msg = error.response?.data?.message || error.friendlyMessage || "Internal Server Error";
        return { success: false, data: null, message: msg };
    }
};

export const updateAddress = async (id, payload) => {
    try {
        const { data } = await client.put(`address/update/${id}`, payload);
        return { success: data.success, data: data.address, message: data.message };
    } catch (error) {
        const msg = error.response?.data?.message || error.friendlyMessage || "Internal Server Error";
        return { success: false, data: null, message: msg };
    }
};

export const deleteAddress = async (id) => {
    try {
        const { data } = await client.delete(`address/delete/${id}`);
        return { success: data.success, message: data.message };
    } catch (error) {
        const msg = error.response?.data?.message || error.friendlyMessage || "Internal Server Error";
        return { success: false, message: msg };
    }
};

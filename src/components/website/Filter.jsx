// Server Component — async is intentional and valid here.
// This component is never imported by a Client Component directly;
// it is rendered by the Server Component layout and passed as a JSX
// prop (filterSlot) to the Client Component shell.

import { fetchCategory, fetchRooms } from "@/utils/api";
import FilterSection from "./FilterSection";
import PriceFilter from "./PriceFilter";

export default async function Filter() {
    const [roomRes, categoryRes] = await Promise.all([
        fetchRooms({ status: true }),
        fetchCategory(),
    ]);

    return (
        <div className="space-y-8 w-full">
            <FilterSection
                title="Room Type"
                data={roomRes.data ?? []}
                queryKey="room"
            />
            <FilterSection
                title="Category"
                data={categoryRes.data ?? []}
                queryKey="category"
            />
            <PriceFilter />
        </div>
    );
}

'use client'

import {
    useRouter,
    useSearchParams,
    usePathname
} from 'next/navigation'

export default function FilterSection({
    title,
    data,
    queryKey
}) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const selectedValues =
        searchParams.get(queryKey)?.split(',') || []
  

    const handleFilter = (item) => {

        const params = new URLSearchParams(
            searchParams.toString()
        )
      
        const value = item.slug

        const currentValues =
            params.get(queryKey)?.split(',') || []

        let updatedValues = []

        if (currentValues.includes(value)) {

            updatedValues = currentValues.filter(
                slug => slug !== value
            )

        } else {

            updatedValues = [
                ...currentValues,
                value
            ]
        }

        if (updatedValues.length > 0) {

            params.set(
                queryKey,
                updatedValues.join(',')
            )

        } else {

            params.delete(queryKey)
        }

        router.push(
            `${pathname}?${params.toString()}`
        )
    }

    return (
        <div className="border-b border-gray-200 pb-8">
            <h3 className="mb-5 text-xl font-semibold">
                {title}
            </h3>

            <div className="space-y-4">
                {data.map((item) => {

                    const checked =
                        selectedValues.includes(
                            item.slug
                        )

                    return (
                        <label
                            key={item._id}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                        handleFilter(item)
                                    }
                                    className="h-5 w-5 accent-amber-700"
                                />

                                <span>
                                    {item.name}
                                </span>

                            </div>

                            {item.count && (
                                <span>
                                    {item.count}
                                </span>
                            )}
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
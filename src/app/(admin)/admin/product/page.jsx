export const dynamic = "force-dynamic";

import ActionDropdown from "@/components/admin/ActionDropdown";
import { fetchProductServer } from "@/utils/api.server";
import TableHeader from "@/components/admin/TableHeader";
import TableFilter from "@/components/admin/TableFilter";
import StatusBtn from "@/components/admin/StatusBtn";
import ProductStatus from "@/components/admin/ProductStatus";
// Using next/image for optimised, safe image rendering
import Image from "next/image";

export default async function Page() {
  const product = await fetchProductServer();

  // ERROR HANDLE
  if (product?.success === false) {
    throw new Error(product?.message || "Failed to fetch Products");
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* HEADER */}
      <TableHeader title="Products" path="/admin/product/add" />

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        {/* FILTER */}
        <TableFilter />

        {/* TABLE HEADER */}
        <div className="hidden lg:grid grid-cols-12 border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Thumbnail
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Product Name
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Category
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Price
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Status
            </p>
          </div>
          <div className="col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Flags
            </p>
          </div>
          <div className="col-span-1 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Action
            </p>
          </div>
        </div>

        {/* TABLE BODY */}
        <div>
          {product?.data?.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  No Products Found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  There are no products available right now.
                </p>
              </div>
            </div>
          ) : (
            product?.data?.map((item, index) => {
              // Treat empty string / null / undefined as "no thumbnail"
              const hasThumbnail = Boolean(item.thumbnail?.trim());

              return (
                <div
                  key={item._id || index}
                  className="grid grid-cols-1 gap-4 border-b border-gray-100 px-6 py-5 transition-all duration-300 hover:bg-gray-50 lg:grid-cols-12 lg:items-center"
                >
                  {/* MOBILE CARD
                      Same guard: only render the image element when a URL actually exists.
                  */}
                  <div className="flex items-center gap-4 lg:hidden">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-100">
                      {hasThumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name || "Product thumbnail"}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xl text-gray-400">
                          🛋️
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {item?.categoryId?.name}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-semibold text-green-600">
                          ₹{item.salePrice}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.originalPrice}
                        </span>
                        <span className="text-xs font-medium text-red-500">
                          {item.discount}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* THUMBNAIL — desktop
                      Using next/image with fill + a positioned parent instead of raw <img>.
                  */}
                  <div className="hidden lg:flex lg:col-span-1">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-gray-100">
                      {hasThumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name || "Product thumbnail"}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xl text-gray-400">
                          🛋️
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PRODUCT NAME */}
                  <div className="lg:col-span-2">
                    <h2 className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </h2>
                  </div>

                  {/* CATEGORY */}
                  <div className="hidden lg:block lg:col-span-2">
                    <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {item?.categoryId?.name}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="hidden lg:block lg:col-span-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-green-600">
                        ₹{item.salePrice}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                      <span className="text-xs font-medium text-red-500">
                        {item.discount}% OFF
                      </span>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="lg:col-span-1">
                    <StatusBtn
                      status={item.status}
                      path={`product/status-update/${item._id}`}
                    />
                  </div>

                  {/* FLAGS */}
                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-2">
                      <ProductStatus status={item.bestSeller} flag="bestSeller" id={item._id} />
                      <ProductStatus status={item.stock} flag="stock" id={item._id} />
                      <ProductStatus status={item.newArrival} flag="newArrival" id={item._id} />
                      <ProductStatus status={item.featured} flag="featured" id={item._id} />
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="hidden justify-end lg:flex lg:col-span-1">
                    <ActionDropdown module="product" id={item._id} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

 export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#f8f5f1]">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-[#2b1d14] text-white flex-col items-center justify-between py-16 px-10">

        <h1 className="text-3xl tracking-[8px]">
          NESTRO<span className="text-[#9b6b42]">.</span>
        </h1>

        <div className="text-center">

          <div className="mx-auto mb-20 w-40 h-28 bg-[#806246] rounded-xl"></div>

          <h2 className="text-5xl font-light">
            Your <i>Dream Home</i>
            <br />
            Starts Here
          </h2>

          <p className="mt-8 text-gray-400">
            Join 12,000 homeowners who've transformed their
            <br />
            living spaces with Nestro.
          </p>

        </div>

        <div className="text-gray-300 text-center">
          🚚 Free delivery + white glove assembly
          <br />
          ☆ Earn reward points on every purchase
        </div>

      </div>

      {/* Right Section */}

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>

    </div>
  );
}
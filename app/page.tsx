export default function Home() {
  return (
    <main className="bg-gray-300 h-screen flex justify-center items-center p-5">
      <div className="bg-white shadow-lg rounded-2xl w-full p-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-500 font-semibold -mb-1">
              In transit
            </span>
            <span className="text-4xl font-semibold">Coolblue</span>
          </div>
          <div className="size-12 rounded-full bg-orange-400 " />
        </div>
        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-400 px-2.5 py-1.5 rounded-full text-white uppercase text-sm font-medium">
            Today
          </span>
          <span>9:30-10:30</span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 absolute w-full rounded-full h-2" />
          <div className="bg-green-500 absolute w-2/3 rounded-full h-2" />
        </div>
        <div className="flex justify-between items-center mt-5 text-gray-600">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-400">Delivered</span>
        </div>
      </div>
    </main>
  );
}

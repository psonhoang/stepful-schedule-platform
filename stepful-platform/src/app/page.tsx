export default function Home() {
  return (
    <main className="flex min-h-50 flex-col items-center justify-between p-24">
      <div className="flex flex-col space-y-10 items-center justify-center p-56">
        <h1 className="text-2xl font-bold">Stepful</h1>
        <div className="flex flex-row space-x-5">
          <button
            type="button"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded "
          >
            Coach
          </button>
          <button
            type="button"
            className="bg-pink-500 text-white font-bold py-2 px-4 rounded"
          >
            Student
          </button>
        </div>
      </div>
    </main>
  );
}

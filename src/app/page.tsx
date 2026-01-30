import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-8 sm:py-16 md:py-24 px-4 sm:px-0">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Welcome to EStore
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-4 sm:px-0">
            Discover amazing products at unbeatable prices. Browse our extensive collection of quality items.
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 sm:py-12 px-4 sm:px-0">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            'electronics',
            'clothing',
            'home-decoration',
            'sports',
          ].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category}`}
              className="group rounded-lg border border-gray-200 p-3 sm:p-6 hover:shadow-lg active:shadow-lg transition-shadow dark:border-gray-700 touch-manipulation"
            >
              <div className="h-24 sm:h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3 sm:mb-4 group-hover:scale-105 transition-transform" />
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {category.replace('-', ' ')}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 bg-blue-600 rounded-lg text-white mt-8 sm:mt-12 mx-4 sm:mx-0">
        <div className="text-center px-4">
          <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Exclusive Deals Await
          </h2>
          <p className="mb-4 sm:mb-6 text-blue-100 text-sm sm:text-base">
            Sign up for our newsletter to get the latest offers and updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 sm:py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 active:bg-blue-900 px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors touch-manipulation min-h-[44px] sm:min-h-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

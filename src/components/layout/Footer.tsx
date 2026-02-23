export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-3 sm:mb-4">
                            EStore
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Your trusted online shopping destination for quality products at great prices.
                        </p>
                        <br />
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Gmail: dominhnhat328@gmail.com
                        </p>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3 sm:mb-4">
                            Products
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Sale</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">All Products</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3 sm:mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Contact Us</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Returns</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3 sm:mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1 block">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p>&copy; 2026 EStore. All rights reserved.</p>
                    <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
                        <a href="https://www.facebook.com/profile.php?id=100011246080118" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1">Facebook</a>
                        <a href="https://github.com/Do-MinhNhat/E-Commerce_Front-End" className="hover:text-gray-900 dark:hover:text-white transition-colors py-1">Github</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

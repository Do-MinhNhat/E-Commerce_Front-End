export default function ProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                User Profile
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-400">
                    Profile page coming soon. This will display user account information, orders, and settings.
                </p>
            </div>
        </div>
    );
}

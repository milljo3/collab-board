async function Page() {
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Login Error</h1>
            </div>
            <p className="text-destructive">
                Oops! Something went wrong. Please try again.
            </p>
        </div>
    );
}

export default Page;
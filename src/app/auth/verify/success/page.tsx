function Page() {
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Success</h1>
            </div>
            <p className="text-muted-foreground">
                Success! You have re-sent a verification link to your email.
            </p>
        </div>
    );
}

export default Page;
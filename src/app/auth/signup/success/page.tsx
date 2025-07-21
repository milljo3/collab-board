function Page() {
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Success</h1>
            </div>
            <p className="text-muted-foreground">
                Success! You have successfully registered. Please check your email for the verification link.
                <br/>
                Note: It may take a few minutes.
            </p>
        </div>
    );
}

export default Page;
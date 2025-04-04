import { buttonVariants } from "~/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="mt-4 text-lg text-gray-600">
                Oops! The page you are looking for does not exist.
            </p>
            <a className={buttonVariants({ variant: "outline" })} href="/">
                Go Back to Home
            </a>
        </div>
    );
}

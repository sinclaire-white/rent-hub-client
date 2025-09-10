export default function DashboardFooter() {
    return (
        <footer className="w-full bg-white shadow-inner py-4 mt-auto text-center text-sm text-gray-600">
            <p>
                © {new Date().getFullYear()} RentHub Dashboard. All rights
                reserved.
            </p>
        </footer>
    );
}

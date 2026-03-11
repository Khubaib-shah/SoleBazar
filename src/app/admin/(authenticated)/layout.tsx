import AdminLayout from "@/components/admin/admin-layout";

export default function AuthenticatedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}

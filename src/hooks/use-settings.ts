import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useSettings() {
    const { data, error, isLoading, mutate } = useSWR("/api/admin/settings", fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false
    });

    return {
        settings: data,
        isLoading,
        isError: error,
        mutate
    };
}

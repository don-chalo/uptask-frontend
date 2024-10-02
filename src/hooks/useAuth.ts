import { useQuery } from "@tanstack/react-query"

import { getUser } from "@/api/AuthAPI"

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        refetchInterval: false,
        retry: 0
    });

    return { data, isError, isLoading };
}
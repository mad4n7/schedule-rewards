import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export function useCategories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return {
    categories,
    isLoading,
    error,
  };
}

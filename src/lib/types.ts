export interface ProductWithRelations {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAt: number | null;
    condition: string;
    sizes: string;
    colors: string | null;
    stock: number;
    featured: boolean;
    brandId: string;
    categoryId: string;
    brand: { id: string; name: string; slug: string; icon: string | null };
    category: { id: string; name: string; slug: string; icon: string | null };
    images: { id: string; url: string; alt: string | null; order: number }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface BrandType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

export interface CategoryType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

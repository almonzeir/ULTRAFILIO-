import { supabase } from './supabase/client';

/**
 * Generates a URL-friendly slug from a string.
 */
export function generateSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Generates a unique slug by checking if it already exists in the portfolios table.
 * If it exists, it appends a number (e.g., slug-1, slug-2).
 */
export async function generateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = generateSlug(baseName) || 'portfolio';
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const { data, error } = await supabase
            .from('portfolios')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.error('Error checking slug uniqueness:', error);
            // If error, just break and return current slug (might fail insert later but safe for now)
            break;
        }

        if (!data) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return slug;
}

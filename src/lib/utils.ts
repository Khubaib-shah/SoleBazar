export function getInitials(name: string): string {
    if (!name) return "SB";
    
    // Split by spaces
    const words = name.trim().split(/\s+/);
    
    if (words.length >= 2) {
        // Use first letter of first and last word
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    
    // Single word: Try to find capital letters (e.g., SoleBazar -> SB)
    const caps = name.match(/[A-Z]/g);
    if (caps && caps.length >= 2) {
        return (caps[0] + caps[caps.length - 1]).toUpperCase();
    }
    
    // Fallback: Just take first two letters
    return name.substring(0, 2).toUpperCase();
}

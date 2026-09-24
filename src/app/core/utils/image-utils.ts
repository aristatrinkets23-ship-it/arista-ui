export function getFallbackProductImage(nameOrCategory?: string): string {
  if (!nameOrCategory) return '/assets/images/precious-jewellery-hero.jpg';
  const s = String(nameOrCategory).toLowerCase();
  if (s.includes('ring')) return '/assets/images/occasion-daily-wear.jpg';
  if (s.includes('necklace') || s.includes('pendant') || s.includes('choker')) return '/assets/images/occasion-wedding.jpg';
  if (s.includes('earring') || s.includes('stud') || s.includes('hoop')) return '/assets/images/occasion-gifting.jpg';
  if (s.includes('bracelet') || s.includes('bangle') || s.includes('cuff')) return '/assets/images/occasion-festive.jpg';
  return '/assets/images/precious-jewellery-hero.jpg';
}

export function resolveProductImage(img?: string, nameOrCategory?: string): string {
  if (
    !img ||
    typeof img !== 'string' ||
    img.trim() === '' ||
    img.includes('placeholder-jewellery.svg') ||
    img.includes('placeholder-rings.svg') ||
    img.includes('placeholder-necklaces.svg') ||
    img.includes('placeholder-earrings.svg') ||
    img.includes('placeholder-bracelets.svg')
  ) {
    return getFallbackProductImage(nameOrCategory);
  }
  return img.trim();
}

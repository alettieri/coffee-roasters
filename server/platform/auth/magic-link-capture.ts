export interface CapturedMagicLink {
  email: string;
  url: string;
  token: string;
  metadata?: Record<string, unknown>;
}

const capturedMagicLinks: CapturedMagicLink[] = [];

export function captureMagicLink(link: CapturedMagicLink): void {
  capturedMagicLinks.push({
    ...link,
    metadata: link.metadata ? { ...link.metadata } : undefined,
  });
}

export function listCapturedMagicLinks(): CapturedMagicLink[] {
  return capturedMagicLinks.map((link) => ({
    ...link,
    metadata: link.metadata ? { ...link.metadata } : undefined,
  }));
}

export function resetCapturedMagicLinks(): void {
  capturedMagicLinks.splice(0, capturedMagicLinks.length);
}

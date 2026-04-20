import QRCode from 'qrcode'

const hexRe = /^#[0-9A-Fa-f]{6}$/

function normalizeHex(c: string | undefined, fallback: string): string {
  if (!c || !hexRe.test(c)) return fallback
  return c
}

export type QrCodeGeneratorInput = {
  /** Destination URL or text payload */
  payload: string
  dark?: string
  light?: string
  /** QR module width in CSS pixels (approx) */
  width?: number
  margin?: number
}

export type QrCodeGeneratorResult = { dataUrl: string } | { error: string }

export async function buildQrDataUrl(input: QrCodeGeneratorInput): Promise<QrCodeGeneratorResult> {
  const raw = input.payload.trim()
  if (!raw || raw.length > 2048) {
    return { error: 'Payload must be 1–2048 characters.' }
  }
  const dark = normalizeHex(input.dark, '#000000')
  const light = normalizeHex(input.light, '#ffffff')
  const width = Math.min(512, Math.max(120, Math.round(input.width ?? 280)))
  const margin = Math.min(8, Math.max(0, Math.round(input.margin ?? 2)))
  try {
    const dataUrl = await QRCode.toDataURL(raw, {
      width,
      margin,
      color: { dark, light },
      errorCorrectionLevel: 'M',
    })
    return { dataUrl }
  } catch {
    return { error: 'Could not build QR code for this payload.' }
  }
}

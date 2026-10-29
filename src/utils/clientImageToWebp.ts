/**
 * Client-Side PNG/Image to WebP Conversion Utility
 * Allows converting images (File, Blob, HTMLImageElement, or URL) to optimized WebP format in the browser.
 */

export interface ConvertToWebpOptions {
  quality?: number // 0.1 to 1.0 (default 0.9)
  maxWidth?: number
  maxHeight?: number
}

/**
 * Converts an image source to a WebP Blob in the browser
 */
export async function convertImageToWebpBlob(
  imageSource: File | Blob | string | HTMLImageElement,
  options: ConvertToWebpOptions = {}
): Promise<Blob> {
  const { quality = 0.9, maxWidth, maxHeight } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      let width = img.naturalWidth || img.width
      let height = img.naturalHeight || img.height

      // Handle optional resizing
      if (maxWidth && width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      if (maxHeight && height > maxHeight) {
        width = Math.round((width * maxHeight) / height)
        height = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas 2D context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas WebP blob conversion failed'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = (err) => {
      reject(err)
    }

    if (typeof imageSource === 'string') {
      img.src = imageSource
    } else if (imageSource instanceof HTMLImageElement) {
      img.src = imageSource.src
    } else {
      img.src = URL.createObjectURL(imageSource)
    }
  })
}

/**
 * Converts an image source to a WebP Data URL string in the browser
 */
export async function convertImageToWebpDataUrl(
  imageSource: File | Blob | string | HTMLImageElement,
  options: ConvertToWebpOptions = {}
): Promise<string> {
  const blob = await convertImageToWebpBlob(imageSource, options)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

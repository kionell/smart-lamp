export function setColorValue (color) {
  let rgb = { r: 0, g: 0, b: 0 }
  if (/#/.test(color)) {
    rgb = hex2rgb(color)
  } else if (/rgb/.test(color)) {
    rgb = str2rgb(color)
  } else if (typeof color === 'string') {
    rgb = str2rgb(`rgb(${color})`)
  } else if (Object.prototype.toString.call(color) === '[object Object]') {
    rgb = color
  }

  const { r, g, b } = rgb
  const { h, s, v } = rgb2hsv(rgb)

  return { r, g, b, h, s, v }
}

export function setColorValueByHSV (color) {
  let hsv = { h: 0, s: 0, v: 0 }

  if (Object.prototype.toString.call(color) === '[object Object]') {
    hsv = color
  }

  const { h, s, v } = hsv
  const { r, g, b } = hsv2rgb(hsv)

  return { r, g, b, h, s, v }
}

export function createAlphaSquare (size) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const doubleSize = size * 2
  canvas.width = doubleSize
  canvas.height = doubleSize

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, doubleSize, doubleSize)
  ctx.fillStyle = '#ccd5db'
  ctx.fillRect(0, 0, size, size)
  ctx.fillRect(size, size, size, size)

  return canvas
}

export function createLinearGradient (
  direction,
  ctx,
  width,
  height,
  color1,
  color2
) {
  // l horizontal p vertical
  const isL = direction === 'l'
  const gradient = ctx.createLinearGradient(
    0,
    0,
    isL ? width : 0,
    isL ? 0 : height
  )
  gradient.addColorStop(0.01, color1)
  gradient.addColorStop(0.99, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export function rgb2hex ({ r, g, b }, toUpper = true) {
  const change = (val) => ('0' + Number(val).toString(16)).slice(-2)
  const color = `#${change(r)}${change(g)}${change(b)}`
  return toUpper ? color.toUpperCase() : color
}

export function hex2rgb (hex) {
  hex = hex.slice(1)
  const change = (val) => parseInt(val, 16) || 0 // Avoid NaN situations
  return {
    r: change(hex.slice(0, 2)),
    g: change(hex.slice(2, 4)),
    b: change(hex.slice(4, 6))
  }
}

export function str2rgb (str) {
  if (typeof str === 'string') {
    str = (/rgb?\((.*?)\)/.exec(str) || ['', '0,0,0'])[1].split(',')
    return {
      r: str[0] || 0,
      g: str[1] || 0,
      b: str[2] || 0
    }
  } else {
    return str
  }
}

export function rgb2hsv ({ r, g, b }) {
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (max === min) {
    h = 0
  } else if (max === r) {
    if (g >= b) {
      h = (60 * (g - b)) / delta
    } else {
      h = (60 * (g - b)) / delta + 360
    }
  } else if (max === g) {
    h = (60 * (b - r)) / delta + 120
  } else if (max === b) {
    h = (60 * (r - g)) / delta + 240
  }
  h = Math.floor(h)
  const s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
  const v = parseFloat(max.toFixed(2))
  return { h, s, v }
}

export function hsv2rgb ({ h, s, v }) {
  const C = s * v
  const X = C * (1 - Math.abs((h / 60) % 2 - 1))

  const m = v - C

  let r, g, b

  if (h <= 360) { r = C; g = 0; b = X }
  if (h <= 300) { r = X; g = 0; b = C }
  if (h <= 240) { r = 0; g = X; b = C }
  if (h <= 180) { r = 0; g = C; b = X }
  if (h <= 120) { r = X; g = C; b = 0 }
  if (h <= 60) { r = C; g = X; b = 0 }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

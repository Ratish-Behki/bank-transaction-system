import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'app_zoom_percent'

const ZoomControl = () => {
  const [percent, setPercent] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 110
  })

  useEffect(() => {
    // apply zoom using CSS zoom for crisp scaling in Chromium
    try { document.documentElement.style.zoom = `${percent}%` } catch (e) {}
    localStorage.setItem(STORAGE_KEY, String(percent))
  }, [percent])

  const inc = () => setPercent(p => Math.min(200, p + 10))
  const dec = () => setPercent(p => Math.max(50, p - 10))

  return (
    <div className="flex items-center gap-2">
      <button onClick={dec} className="bg-white text-blue-600 px-2 py-1 rounded">-</button>
      <div className="text-sm text-white">{percent}%</div>
      <button onClick={inc} className="bg-white text-blue-600 px-2 py-1 rounded">+</button>
    </div>
  )
}

export default ZoomControl

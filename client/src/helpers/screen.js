import { useState, useEffect } from 'react'

function getBreakpoint(width) {
      const _width = width || window.innerWidth

      if (_width >= 1536)
            return '2xl'
      if (_width >= 1280)
            return 'xl'
      if (_width >= 1024)
            return 'lg'
      if (_width >= 768)
            return 'md'
      if (_width >= 640)
            return 'sm'

      return 'xs'
}

function getOrientation() {
      return window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait"
}

function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}

export {
      getBreakpoint,
      getOrientation,
      useViewport
}
import { useRef, useEffect, useState } from 'react'

export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)
  const [intervalId, setIntervalId] = useState()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if(delay === null) return clearInterval(intervalId)
    const id = setInterval(() => savedCallback.current(), delay)
    setIntervalId(id)
    return () => clearInterval(id)
  }, [delay])
}
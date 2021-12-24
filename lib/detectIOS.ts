declare global {
  interface Window {
    MSStream: any // 인터넷 익스플로어 인지 체크
  }
}

export default function detectIOS() {
  if (typeof window !== 'undefined') {
    // checkAgent for Chrome Developer Menu
    const checkAgent = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    const checkPlatform =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !window.MSStream

    return checkAgent || checkPlatform || false
  } else {
    return false
  }
}

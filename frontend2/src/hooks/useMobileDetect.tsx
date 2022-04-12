//https://github.com/haldarmahesh/use-mobile-detect-hook
// Copyright (c) 2018 Mahesh Haldar MIT license
const getMobileDetect = (userAgent: string) => {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i))
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i))
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i))
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i))

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows())
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR())
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  }
}
const useMobileDetect = () => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent
  return getMobileDetect(userAgent)
}

export default useMobileDetect

/*
MIT License

Copyright (c) 2018 Mahesh Haldar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export const handleBlurForInnerElements = (
  e: React.FocusEvent<any, Element>,
  callback: () => void
) => {
  const currentTarget = e.currentTarget

  // Check the newly focused element in the next tick of the event loop
  setTimeout(() => {
    // Check if the new activeElement is a child of the original container
    if (!currentTarget.contains(document.activeElement)) {
      // You can invoke a callback or add custom logic here
      callback()
    }
  }, 0)
}

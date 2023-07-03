// Element needs to have tabIndex to receive focus
// if Element in focus is removed on next render use ref.current?.focus?.() on container

export const handleBlurForInnerElements = (callback: () => void) => {
  return (e: React.FocusEvent<any, Element>) => {
    const currentTarget = e.currentTarget;
    // Check the newly focused element in the next tick of the event loop
    setTimeout(() => {
      // console.log(document.activeElement)
      // Check if the new activeElement is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        // You can invoke a callback or add custom logic here
        callback();
      }
    }, 0);
  };
};

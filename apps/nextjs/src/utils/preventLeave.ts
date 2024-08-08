const preventLeave = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = true;
};

export default preventLeave;

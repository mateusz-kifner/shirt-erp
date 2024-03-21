function getBase64FromImage(file: File | undefined): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = (error) => reject(error);
  });
}
export default getBase64FromImage;

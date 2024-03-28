import BarcodeReader from "@/page-components/erp/barcode/Scanner";

function ScannerPage() {
  return (
    <div className="flex items-center justify-center">
      <BarcodeReader />
    </div>
  );
}

export default ScannerPage;
